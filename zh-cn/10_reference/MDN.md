# 如何通过 MDN 学习 Web 技术

## 几个问题

### 现在还需要学习 Web 技术吗？

产生这个问题的原因有几个：

1. 随着 React/Vue/Angular 等框架的普及、私有化技术（小程序）在移动端的大规模使用，原生（传统）的 Web 技术变得没有学习的必要了。
2. 随着 Web 技术本身的普及，HTML/Javascript/CSS 对于一部分人来说已经驾轻就熟了，没有什么新的东西可学了。

### MDN 是一个学习网站吗？

很多人把 MDN 当作参考手册，这没有问题。但 MDN 其实是一个记录所有与开放 Web 技术、Mozilla 私有技术、Firefox OS 等相关的技术性文档的站点。它的内容主要通过三个部分进行组织：

- Web 技术（Web Technologies）：记录所有与开放 Web 技术相关的技术性文档。适合有一定基础的开发者。
- 学习 Web 开发（Learn Web Development）：一套详细的初学者学习资料，可以当做教程使用。适合初学者。
- 开发者工具（Developer Tools）：Firefox 开发人员工具的详细指南。

我们平常经常看到的参考手册，是 Web 技术中的一部分。

## 怎么学？

我刚打开 MDN 的时候是一脸懵逼的。相信你也会有这样的感觉：琳琅满目的文章列表，复杂的循环链接跳转…… 我们可能会陷入内容的回调地狱而无法建立一套知识结构体系。

### 页面类型和结构

MDN 上的页面可以分为以下几种类型，一个页面可以属于多个类型：

- 导航页（Navigation）：提供到其他页面的链接，导航页通常是关于某一个相关主题的（参考：[Web media technologies](https://developer.mozilla.org/en-US/docs/Web/Media)）。
- 指南页（Guide）：描述如何做某事或使用某个功能，它的内容是根据目标进行组织的（参考：[Visualizations with Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Visualizations_with_Web_Audio_API)）。
- 参考页（Reference）：描述某个事物的细节，它的内容是根据所描述事物的结构进行组织的（参考：[<video> element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/video)）。
- 教程页（Tutorials）

MDN 的页面是有一定的模板的（遵循一定的组织结构），有如下模板。

#### API landing page

所属类型：

- Navigation
- Reference

主题结构：

- Concepts and usage
- Interfaces/Reference
- Examples
- Specifications
- Browser compatibility

侧边栏结构：

- Guides
- Tutorials
- Interfaces
- Properties
- Methods
- Events

## Web 多媒体技术学习清单

![内容思维图](https://img.alicdn.com/imgextra/i4/O1CN01dXlzb31rrJtiLdfrE_!!6000000005684-55-tps-1678-1721.svg)

### 学习 Web 开发（Learn Web Development）

- [HTML 指南与教程 - 多媒体与嵌入](https://developer.mozilla.org/zh-CN/docs/Learn/HTML/Multimedia_and_embedding)：探索怎样用 HTML 来让网页包含多媒体，包括可以包含图像的不同方式，以及怎样嵌入视频。
- [可访问性 - 多媒体的可访问性](https://developer.mozilla.org/zh-CN/docs/learn/Accessibility/%E5%A4%9A%E5%AA%92%E4%BD%93)：可以提高可访问性的另一类内容是多媒体 - 视频，音频和图像内容需要提供适当的文本替代方案，以便辅助技术和相应的用户能够理解。

### Web 技术（Web Technologies）

- [Web 媒体技术](https://developer.mozilla.org/zh-CN/docs/Web/媒体)：列出了可能对掌握 Web 媒体技术有帮助的多种 API 与其文档链接。
- Web 开发指南：
  - [添加音视频](https://developer.mozilla.org/zh-CN/docs/Web/Guide/Audio_and_video_delivery)：基于 Web 的媒体的各种传输机制以及与流行浏览器的兼容性的入门参考。
  - [控制音视频](https://developer.mozilla.org/zh-CN/docs/Web/Guide/Audio_and_video_manipulation)：将音频和视频数据流与 `<canvas>`，WebGL 或 Web Audio API 等技术一起使用，以直接修改音频和视频的参考。
- Web APIs 参考：
  - [网络音频 API（Web Audio API）](https://developer.mozilla.org/zh-CN/docs/Web/API/Web_Audio_API)
  - [实时通讯 API（WebRTC API）](https://developer.mozilla.org/zh-CN/docs/Web/API/WebRTC_API)
  - [媒体源扩展 API（Media Source Extensions API）](https://developer.mozilla.org/zh-CN/docs/Web/API/Media_Source_Extensions_API) 
  - [媒体捕获和处理 API（Media Capture and Streams API）](https://developer.mozilla.org/zh-CN/docs/Web/API/Media_Streams_API)
  
## 参考资料

- [About MDN Web Docs](https://developer.mozilla.org/en-US/docs/MDN/About)
- [MDN Document structures](https://developer.mozilla.org/en-US/docs/MDN/Structures)
- [API reference sidebars](https://developer.mozilla.org/en-US/docs/MDN/Contribute/Howto/Write_an_API_reference/Sidebars)