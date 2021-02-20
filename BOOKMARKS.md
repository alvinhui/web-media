# 收藏夹

## 课程

- [数字视频技术介绍](https://github.com/leandromoreira/digital_video_introduction/blob/master/README-cn.md)：一份循序渐进的视频技术的介绍，包含图像，视频，编解码器（av1，vp9，h265）以及更多内容（ffmpeg 编码）。
- [web.dev - Media](https://web.dev/media/)：介绍了媒体文件格式的基本概念，演示了准备媒体文件并将它们添加到网站的过程。
- [Google Web Fundamentals - Media & VR](https://developers.google.com/web/fundamentals/media/mobile-web-video-playback)："web.dev - Miedia" 课程的进阶版本，包含媒体捕获、媒体处理和音视频播放相关内容。
- [多媒体前端手册](https://www.yuque.com/webmedia/handbook)：包括音视频基础、直播技术、播放器技术、Web 媒体技术、开源产品和框架介绍等。
- [Coursera - 数字图像和视频处理的基础](https://www.coursera.org/learn/digital)：学习用于处理图像和视频的基本原理和工具，以及如何将其应用于解决商业和科学中的实际问题。
- [即时通讯音视频开发](http://www.52im.net/thread-228-1-1.html)：讲解实时音视频技术中视频技术的编解码基础理论。

> 更多待发掘：[网易云课堂](https://study.163.com/)、[腾讯课堂](https://ke.qq.com/)

## 文档

### [MDN(Mozilla Developer Network)](https://developer.mozilla.org/zh-CN/)

MDN 站点的内容有以下三大部分组成，内容间互有跳转。这个章节梳理了 MDN 中与多媒体相关的文章及其概要。

- Web 技术（Web Technologies）
- 学习 Web 开发（Learn Web Development）
- 开发者工具（Developer Tools）

MDN 的文章可以分为两个类型：

- 索引文章：提供一个主题相关文章的目录
- 内容文章：提供一个主题的具体内容

MDN 的索引文章通常由三部分组成：

- 参考（Reference）
- 指南（Guide）
- 教程（Tutorials）。

#### Web 技术（Web Technologies）

- [Web 媒体技术](https://developer.mozilla.org/zh-CN/docs/Web/媒体)：列出了可能对掌握 Web 媒体技术有帮助的多种 API 与其文档链接。
- Web 开发指南：
  - [添加音视频](https://developer.mozilla.org/zh-CN/docs/Web/Guide/Audio_and_video_delivery)：基于 Web 的媒体的各种传输机制以及与流行浏览器的兼容性的入门参考。
  - [控制音视频](https://developer.mozilla.org/zh-CN/docs/Web/Guide/Audio_and_video_manipulation)：将音频和视频数据流与 `<canvas>`，WebGL 或 Web Audio API 等技术一起使用，以直接修改音频和视频的参考。
- Web APIs 参考：
  - [媒体流处理 API（MediaStream API）](https://developer.mozilla.org/zh-CN/docs/Web/API/Media_Streams_API)
  - [网络音频 API（Web Audio API）](https://developer.mozilla.org/zh-CN/docs/Web/API/Web_Audio_API)
  - [媒体源扩展 API（Media Source Extensions API）](https://developer.mozilla.org/zh-CN/docs/Web/API/Media_Source_Extensions_API) 
  - [加密媒体扩展 API（Encrypted Media Extensions API）](https://developer.mozilla.org/zh-CN/docs/Web/API/Encrypted_Media_Extensions_API)
  - [网络视频文本轨道 API（Web Video Text Tracks Format）](https://developer.mozilla.org/zh-CN/docs/Web/API/WebVTT_API)
  - [Web 实时通讯 API（Web Real-Time Communications API）](https://developer.mozilla.org/zh-CN/docs/Web/API/WebRTC_API)

![MDN 内容脑图](https://img.alicdn.com/imgextra/i1/O1CN018lNLDr1JuLZxSay11_!!6000000001088-2-tps-1587-1372.png)

#### 学习 Web 开发（Learn Web Development）

- [可访问性 - 多媒体的可访问性](https://developer.mozilla.org/zh-CN/docs/learn/Accessibility/%E5%A4%9A%E5%AA%92%E4%BD%93)：可以提高可访问性的另一类内容是多媒体 - 视频，音频和图像内容需要提供适当的文本替代方案，以便辅助技术和相应的用户能够理解。
- [HTML 指南与教程 - 多媒体与嵌入](https://developer.mozilla.org/zh-CN/docs/Learn/HTML/Multimedia_and_embedding)：探索怎样用 HTML 来让网页包含多媒体，包括可以包含图像的不同方式，以及怎样嵌入视频。

### [W3C(World Wide Web Consortium)](https://www.w3.org/)

- [Web Roadmap - Overview of Media Technologies for the Web](https://w3c.github.io/web-roadmaps/media/)
- [Web Media Application Developer Guidelines](https://github.com/w3c/webmediaguidelines/)
- [Web Media API](https://github.com/w3c/webmediaapi/)

## 组织

W3C:

- 工作组
  - [Web 超文本应用技术工作组（WHATWG）](https://whatwg.org/)
  - [网络实时通信工作组（Web Real-Time Communications Working Group）](https://www.w3.org/groups/wg/webrtc)
  - [音频工作组（Audio Working Group）](https://www.w3.org/2011/audio/)
  - [媒体工作组（Media Working Group）](https://www.w3.org/media-wg/)
  - [定时文本工作组（Timed Text Working Group）](https://www.w3.org/AudioVideo/TT/)
- 社区组
  - [Web 媒体 API 社区组（Web Media API Community Group）](https://www.w3.org/community/webmediaapi)
- 兴趣小组
  - [媒体和娱乐兴趣小组（Media and Entertainment Interest Group）](https://www.w3.org/groups/ig/me)

其他：

- [开放媒体联盟（AOMedia）](http://aomedia.org/)：由硬件厂商（Intel, AMD, ARM , Nvidia, Cisco）、内容分发商（Google, Netflix, Amazon）和浏览器维护者（Google, Mozilla）等公司创建，目标是打造一个免版税的视频编解码器。

## 浏览器支持性

- [Chrome Releases](https://chromestatus.com/features/schedule)
- [Firefox Releases](https://www.mozilla.org/firefox/releases/)
- [Safari Release Notes](https://developer.apple.com/documentation/safari-release-notes)

## [Awesome](https://github.com/sindresorhus/awesome)

- Audio
  - [Awesome Music](https://github.com/ciconia/awesome-music)
  - [Audio Visualization](https://github.com/willianjusten/awesome-audio-visualization)
  - [Awesome WebAudio](https://github.com/notthetup/awesome-webaudio)
- Video
  - [Awesome Video](https://github.com/krzemienski/awesome-video)
  - [Streaming Onboarding](https://github.com/Eyevinn/streaming-onboarding)

## 资源

演讲视频、PPT、图像。

- [多媒体前端知识图谱](https://cdn.nlark.com/yuque/0/2019/jpeg/666307/1576205595971-af321329-d743-4ad8-8263-ca9a49531b1e.jpeg)，来自[《多媒体前端手册》](https://www.yuque.com/webmedia/handbook)
- [多媒体前端体系](https://img.alicdn.com/tfs/TB1wLphSXY7gK0jSZKzXXaikpXa-2348-1220.png)，来自[《我的前端成长之路： 在阿里七年，我的成长和迷茫》](https://fed.taobao.org/blog/taofed/do71ct/ttpk5r)
