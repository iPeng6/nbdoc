const cacheVersion = "v2";

const addResourcesToCache = async (resources) => {
  const cache = await caches.open(cacheVersion);
  await cache.addAll(resources);
};

const putInCache = async (request, response) => {
  const cache = await caches.open("v1");
  await cache.put(request, response);
};

const cacheFirst = async ({ request, preloadResponsePromise }) => {
  // 首先，尝试从缓存中获取资源
  const responseFromCache = await caches.match(request);
  if (responseFromCache) {
    return responseFromCache;
  }

  // 接下来，尝试使用缓存或预加载的响应
  const preloadResponse = await preloadResponsePromise;
  if (preloadResponse) {
    console.info("using preload response", preloadResponse);
    putInCache(request, preloadResponse.clone());
    return preloadResponse;
  }

  // 然后尝试从网络中获取资源
  const responseFromNetwork = await fetch(request);
  putInCache(request, responseFromNetwork.clone());
  return responseFromNetwork;
};

// 启用导航预加载
const enableNavigationPreload = async () => {
  if (self.registration.navigationPreload) {
    await self.registration.navigationPreload.enable();
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
      "/",
      "/index.html",
      "/l-md.html",
      "/layout.html",
      "/page.html",
      "app-config.mjs",
    ]),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(deleteOldCaches());
  event.waitUntil(enableNavigationPreload());
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
      preloadResponsePromise: event.preloadResponse,
    }),
  );
});
