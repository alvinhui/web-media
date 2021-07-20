# 播放流媒体

![](https://www.cloudflare.com/img/learning/performance/what-is-streaming/what-is-streaming.svg)

## 目录

- 关于流媒体
  - 什么是流媒体？
  - 什么是实时流媒体？
  - 流媒体和静态媒体有什么区别？
  - 流媒体在点播中的运用
- 自适应流媒体
  - 什么是缓冲？
  - 什么是流媒体比特率？
  - 什么是自适应播放？
  - 自适应流媒体是如何工作的？
- 流媒体协议
  - 什么是流媒体协议？
  - 什么是 HLS？
  - 什么是 MPEG-DASH？
  - HLS 与 MPEG-DASH 的主要区别是什么？
- 流媒体服务
- 播放流媒体
  - 流媒体文件格式
  - 生成流媒体文件
  - 在浏览器中使用

## 关于流媒体

实时流媒体通常简称为流媒体，是将媒体“实时”传输到计算机和设备的过程。在将流媒体传输到浏览器时，关键的考虑因素是我们不是在播放有限的文件，而是在传递一个正在动态创建的文件，并且没有预先确定的开始或结束。

### 流媒体和静态媒体有什么区别？

这里使用静态媒体来描述由文件表示的媒体，无论是 mp3 文件还是 WebM 文件。该文件位于服务器上，可以像大多数其他文件一样传送到浏览器。这个过程通常称为渐进式下载。

流媒体没有有限的开始和结束时间，因为它不是一个静态文件，而是一个数据流，服务器通过网络传递到浏览器，并且通常是自适应的。通常需要不同的数据格式和特殊的服务器端软件来实现这一点。

## 自适应流媒体

流媒体优先要解决的问题是保持播放器与流之间的同步：自适应流是一种在低带宽情况下实现这一点的技术。方法是，监控数据传输速率，如果它看起来跟不上，我们就下降到一个较低带宽（因此质量较低）的流。

为了拥有这种能力，我们需要使用有助于实现这一点的数据格式。流媒体格式通常通过将流分成一系列小片段并使这些片段以不同的质量和比特率可用来实现自适应流。

### 流媒体在点播中的运用

流媒体技术并非仅用于实时场景（直播）。它也可以用来代替传统的渐进式音频和视频点播下载方法，这有几个好处：

- 延迟通常较低，因此媒体将更快地开始播放
- 自适应流媒体有助于在各种设备上获得更好的体验
- 媒体下载及时，带宽利用率更高

## 流媒体协议

虽然静态媒体通常通过 HTTP 提供服务，但有多种协议可用于提供自适应流：

- HTTP: 目前最常用的按需或实时传输媒体的协议。
- RTMP: Real Time Messaging Protocol（实时消息传输协议）的首字母缩写，是由 [Macromedia](https://zh.wikipedia.org/wiki/Macromedia)（现为 Adobe）开发的专有网络应用层协议，主要用于 Flash。RTMP 有许多变种，包括 RTMPE、RTMPS 和 RTMPT。
- RTSP: Real Time Streaming Protocol（实时流协议）的首字母缩写，）是一种网络应用层协议，用于创建和控制终端之间的媒体会话，通常与实时传输协议（RTP）和实时控制协议（RTCP）一起用于媒体流传输。

一些基于 HTTP 的实时流媒体视频格式开始得到了跨浏览器的支持。

- DASH(Dynamic Adaptive Streaming over HTTP，基于 HTTP 的动态自适应流，也称 MPEG-DASH): 是一种自适应比特率流技术，使高质量流媒体可以通过传统的 HTTP 协议进行传输。MPEG-DASH 会将内容分解成一系列小型的基于 HTTP 的文件片段，每个片段包含很短长度的可播放内容，而内容总长度可能长达数小时。内容将被制成多种比特率的备选片段，以提供多种比特率的版本供选用。当内容被 MPEG-DASH 客户端播放时，客户端将根据当前网络条件自动选择下载和播放哪一个备选方案。客户端将选择可及时下载的最高比特率片段进行播放，从而避免播放卡顿或重新缓冲。也因如此，MPEG-DASH 客户端可以无缝适应不断变化的网络条件并提供高质量的播放体验，拥有更少的卡顿与重新缓冲发生率。
- HLS(HTTP Live Streaming) 是 Apple 提出的直播流协议。它的工作原理是把一段视频流切分成一个个的小块，并基于 HTTP 的文件来下载。当媒体流正在播放时，客户端可以根据当前网络环境，方便地在不同的码率流中做切换，以实现更好的观影体验。

## 流媒体服务

为了流式传输实时音频和视频，将需要在服务器上运行特定的流式软件或使用第三方服务。

- GStreamer
- SHOUTcast
- Icecast
- Streaming Services

## 播放流媒体

### 流媒体文件格式

- MPEG-DASH 编码：
  - Ondemand Profile
  - LIVE Profile
- HLS 编码

### 生成流媒体文件

...


### 在浏览器中使用

...

## 参考资料

- [Live streaming web audio and video](https://developer.mozilla.org/en-US/docs/Web/Guide/Audio_and_video_delivery/Live_streaming_web_audio_and_video)
- [Setting up adaptive streaming media sources](https://developer.mozilla.org/en-US/docs/Web/Guide/Audio_and_video_delivery/Setting_up_adaptive_streaming_media_sources)
- [DASH Adaptive Streaming for HTML 5 Video](https://developer.mozilla.org/en-US/docs/Web/Media/DASH_Adaptive_Streaming_for_HTML_5_Video)
- [Adaptive Bitrate Streaming: What it Is and How the ABR Algorithm Works](https://www.dacast.com/blog/adaptive-bitrate-streaming/)
- [HLS vs. MPEG-DASH: A Live Streaming Protocol Comparison for 2021](https://www.dacast.com/blog/mpeg-dash-vs-hls-what-you-should-know/)
- [什么是流传输？| 视频流传输如何工作](https://www.cloudflare.com/zh-cn/learning/video/what-is-streaming/)
- [什么是直播？| 直播的工作原理](https://www.cloudflare.com/learning/video/what-is-live-streaming)
- [什么是 MPEG-DASH？| HLS 与 DASH](https://www.cloudflare.com/zh-cn/learning/video/what-is-mpeg-dash/)
- [什么是 HTTP 实时流式传输？| HLS 流式传输](https://www.cloudflare.com/zh-cn/learning/video/what-is-http-live-streaming/)
- [自适应 HTTP 流技术：HLS 与 DASH](https://strivecast.com/hls-vs-mpeg-dash/)