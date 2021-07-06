# 播放流媒体

## 实时流媒体

实时流媒体通常简称为流媒体，是将媒体“实时”传输到计算机和设备的过程。在将流媒体传输到浏览器时，关键的考虑因素是我们不是在播放有限的文件，而是在传递一个正在动态创建的文件，并且没有预先确定的开始或结束。

### 流媒体和静态媒体之间的主要区别

这里使用静态媒体来描述由文件表示的媒体，无论是 mp3 文件还是 WebM 文件。该文件位于服务器上，可以像大多数其他文件一样传送到浏览器。这个过程通常称为渐进式下载。

流媒体没有有限的开始和结束时间，因为它不是一个静态文件，而是一个数据流，服务器通过网络传递到浏览器，并且通常是自适应的。通常需要不同的数据格式和特殊的服务器端软件来实现这一点。

### 自适应流

流媒体优先要解决的问题是保持播放器与流之间的同步：自适应流是一种在低带宽情况下实现这一点的技术。方法是，监控数据传输速率，如果它看起来跟不上，我们就下降到一个较低带宽（因此质量较低）的流。

为了拥有这种能力，我们需要使用有助于实现这一点的数据格式。流媒体格式通常通过将流分成一系列小片段并使这些片段以不同的质量和比特率可用来实现自适应流。

### 流媒体在点播中的运用

流媒体技术并非仅用于实时场景（直播）。它也可以用来代替传统的渐进式音频和视频点播下载方法，这有几个好处：

- 延迟通常较低，因此媒体将更快地开始播放
- 自适应流媒体有助于在各种设备上获得更好的体验
- 媒体下载及时，带宽利用率更高

### 流媒体协议

虽然静态媒体通常通过 HTTP 提供服务，但有多种协议可用于提供自适应流：

- HTTP: 目前最常用的按需或实时传输媒体的协议。
- RTMP: Real Time Messaging Protocol（实时消息传输协议）的首字母缩写，是由 Macromedia（现为Adobe）开发的专有网络应用层协议，主要用于 Flash。RTMP 有许多变种，包括 RTMPE、RTMPS 和 RTMPT。
- RTSP: Real Time Streaming Protocol（实时流协议）的首字母缩写，）是一种网络应用层协议，用于创建和控制终端之间的媒体会话，通常与实时传输协议（RTP）和实时控制协议（RTCP）一起用于媒体流传输。

### 流媒体文件格式

一些基于 HTTP 的实时流媒体视频格式开始得到跨浏览器的支持。

视频流：

- MPEG-DASH
- HLS

音频流：

- Opus
- MP3, AAC, Ogg Vorbis

### 流媒体服务

为了流式传输实时音频和视频，将需要在服务器上运行特定的流式软件或使用第三方服务。

- GStreamer
- SHOUTcast
- Icecast
- Streaming Services

## 自适应流媒体源格式

- MPEG-DASH 编码：
  - Ondemand Profile
  - LIVE Profile
- HLS 编码

## 使用自适应流媒体

...

### 生成流媒体文件

...


### 在浏览器中使用

...

## 参考资料

- [Live streaming web audio and video](https://developer.mozilla.org/en-US/docs/Web/Guide/Audio_and_video_delivery/Live_streaming_web_audio_and_video)
- [Setting up adaptive streaming media sources](https://developer.mozilla.org/en-US/docs/Web/Guide/Audio_and_video_delivery/Setting_up_adaptive_streaming_media_sources)
- [DASH Adaptive Streaming for HTML 5 Video](https://developer.mozilla.org/en-US/docs/Web/Media/DASH_Adaptive_Streaming_for_HTML_5_Video)
- [Demystifying HTML5 Video Player](https://medium.com/@eyevinntechnology/demystifying-html5-video-player-e480846328f0)
- [How to build your own streaming video HTML player](https://medium.com/@eyevinntechnology/how-to-build-your-own-streaming-video-html-player-6ee85d4d078a)