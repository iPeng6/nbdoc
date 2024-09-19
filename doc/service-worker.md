# Service Worker

- sw 第一次安装成功后就会激活
- sw 更新流程
  - install 会先在后台安装
    - 如果调用了 waitUntil 会阻止 install 直到 waitUntil 执行完成（相当于在安装 sw 时，立即同步的做一些事情比如载入缓存）
  - 排队，等待旧版本释放（也就是已经注册的在运行的页面全部关闭）
    - 可以通过使用 [Clients.claim()](https://developer.mozilla.org/zh-CN/docs/Web/API/Clients/claim) 绕过这一点。
  - activate 激活
