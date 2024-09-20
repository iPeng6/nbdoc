# Service Worker

- sw 第一次安装成功后就会激活
- sw 更新流程
  - install 会先在后台安装
    - 如果调用了 waitUntil 会阻止 install 直到 waitUntil 执行完成（相当于在安装 sw 时，立即同步的做一些事情比如载入缓存）
      - [skipWaiting](https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerGlobalScope/skipWaiting) 可以绕过这一点
  - 排队，等待旧版本释放（也就是已经注册的在运行的页面全部关闭）
    - 可以通过使用 [Clients.claim()](https://developer.mozilla.org/zh-CN/docs/Web/API/Clients/claim) 绕过这一点。
  - activate 激活

```js
const cacheVersion = "v1";

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
    // get etag from response
    const etag = responseFromCache.headers.get("etag");

    if (etag) {
      // 探测资源是否有更新
      fetch(request, {
        headers: {
          "If-None-Match": etag,
        },
      }).then((responseFromNetwork) => {
        if (
          responseFromNetwork.status !== 304 &&
          etag !== responseFromNetwork.headers.get("etag")
        ) {
          // 如果资源有更新，我们需要将新的资源放入缓存
          putInCache(request, responseFromNetwork.clone());
        }
      });
    }
    return responseFromCache;
  }

  // 否则尝试从网络中获取资源
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
  self.skipWaiting();
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
  event.waitUntil(self.clients.claim());
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
```
