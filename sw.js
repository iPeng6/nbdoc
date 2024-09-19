const cacheVersion = "v4";

const addResourcesToCache = async (resources) => {
  const cache = await caches.open(cacheVersion);
  await cache.addAll(resources);
};

const putInCache = async (request, response) => {
  const cache = await caches.open(cacheVersion);
  await cache.put(request, response);
};

const cacheFirst = async ({ request }) => {
  // 首先，尝试从缓存中获取资源
  const responseFromCache = await caches.match(request);
  if (responseFromCache) {
    return responseFromCache;
  }

  // 然后尝试从网络中获取资源
  try {
    const responseFromNetwork = await fetch(request);
    // 响应可能会被使用
    // 我们需要将它的拷贝放入缓存
    // 然后再返回该响应
    putInCache(request, responseFromNetwork.clone());
    return responseFromNetwork;
  } catch (error) {
    // 当回落的响应也不可用时，
    // 我们便无能为力了，但我们始终需要
    // 返回 Response 对象
    return new Response("Network error happened", {
      status: 408,
      headers: { "Content-Type": "text/plain" },
    });
  }
};

const deleteCache = async (key) => {
  await caches.delete(key);
};

// 清理旧缓存
const deleteOldCaches = async () => {
  const keyList = await caches.keys();
  const cachesToDelete = keyList.filter((key) => key !== cacheVersion);
  await Promise.all(cachesToDelete.map(deleteCache));
};

self.addEventListener("install", (event) => {
  event.waitUntil(
    addResourcesToCache([
      "app-config.mjs",
      "l-md.html",
      "layout.html",
      "page.html",
      "static/dylogo.png",
      "static/marked/marked-highlight.js",
      "static/menu.css",
      "static/ofa.min.js",
      "static/router.min.js",
    ]),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(deleteOldCaches());
});

self.addEventListener("fetch", (event) => {
  const requestUrl = new URL(event.request.url);
  // only cache http and https requests
  if (requestUrl.protocol !== "http:" && requestUrl.protocol !== "https:") {
    // Handle other schemes if necessary, or just let them pass through
    event.respondWith(fetch(event.request));
    return;
  }
  event.respondWith(
    cacheFirst({
      request: event.request,
    }),
  );
});
