# nbdoc - No Build Doc

一个不需要编译的文档系统，用法只要拷贝本项目，把 doc 改成自己的即可

- 左侧菜单，位置 doc/sidebar.md

## Todo

- [x] Service Worker 缓存优化
- [ ] 菜单折叠
- [x] sidebar 收起
- [x] 适配系统黑色主题
- [x] 响应式适配
- [ ] 全文搜索
- [ ] TOC
- [ ] 图片放大
- [ ] 代码块增强，比如 行高亮，diff显示，文件路径标题，复制等
- [ ] 交互式代码 playground
- [ ] 回到顶部（及 scroll 进度）

## QA

- SSR SEO 呢？

ofa 有官方实现，但是本系统不打算实现，定位为个人文档系统，SEO 现在也只是喂给 AI 的口粮罢了，如果你也想设置 robots 禁用AI爬取，可以参考 https://github.com/ai-robots-txt/ai.robots.txt
