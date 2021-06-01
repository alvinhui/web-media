# 获取屏幕内容

让我们来看一下如何从设备屏幕上获取内容。这里面包含两种情况，一种是将 Web 应用程序中生成或查看的媒体内容转换为媒体流（用于录制或传输），更常见的是将由任何应用程序（或整个屏幕）产生的内容转换成媒体流（截图或录屏）。

## Web 中的媒体内容

将 Web 应用程序中生成或查看的媒体内容转换为媒体流，意思就是从 `<canvas>`，`<audio>` 或 `<video>` 元素捕获媒体流。可以用 `captureStream()` 方法来实现，这使得来自这些元素中的任何视频或音频流都能够通过 WebRTC 进行录制或直播，又或者放到 `<canvas>` 中与特效或其他媒体流相结合。

在下面的示例中，从左侧的 canvas 元素捕获的媒体流转换到右侧的 video 元素：

![示例](https://img.alicdn.com/imgextra/i1/O1CN01uSKWvQ1LIuSUNxZmr_!!6000000001277-1-tps-960-501.gif)

`captureStream()` API 的使用方式非常简单。

从 canvas 元素获取媒体流：

```js
var canvas = document.querySelector('canvas');
var video = document.querySelector('video');

// 每秒帧数参数是可选的。
var stream = canvas.captureStream(25);
// 将 video 元素的源设置为 canvas 中的流
video.srcObject = stream;
```

从 video 元素获取媒体流：

```js
var leftVideo = document.getElementById('leftVideo');
var rightVideo = document.getElementById('rightVideo');

leftVideo.onplay = function() {
  // 将一个 video 元素的源设置为另一个元素的流
  var stream = leftVideo.captureStream();
  rightVideo.srcObject = stream;
};
```

> `captureStream()` 只能在视频元素能够播放视频后调用，这就是为什么我们在 onplay 处理程序中的调用的原因。

### 有哪些应用场景？

`captureStream()` 方法让我们可以从画布和媒体元素录制或实时传输媒体流，那么有哪一些实际的应用场景呢？

- 从 canvas 中录制或直播游戏：例如为用户提供实时的游戏界面分享功能；
- 从照相机捕获视频，然后为其添加其他内容或特效：例如美颜；

  ![示例](https://img.alicdn.com/imgextra/i1/O1CN01cGf9Yz1y0NRnxBmx2_!!6000000006516-0-tps-281-500.jpg)
  > 图片来源：[视频美颜助手app](http://www.87g.com/az/58890.html)
- 使用 canvas 用多个视频实现画中画效果：例如视频通话时的小窗口；

  ![示例](https://img.alicdn.com/imgextra/i2/O1CN01qs3fMu1cSO7exFnaK_!!6000000003599-0-tps-800-390.jpg)
  > 图片来源：[《iOS13新增FaceTime通话注视感知校正功能，视频通话更自然》](http://iphone.poppur.com/Apps/9349.html)
- 在 canvas 中合并视频和图像；

### 小提示

- 尝试对通过[加密媒体扩展](http://www.html5rocks.com/en/tutorials/eme/basics/)实现内容保护的媒体元素使用 `captureStream()` 将引发异常。
- 调用 `captureStream()` 从 `<canvas>` 捕获时可以设置最大帧速率。例如，`canvas.captureStream(10)` 意味着 canvas 输出在 0 到 10fps 之间。如果在 `<canvas>` 上没有绘制任何内容，则不会捕获任何内容。即使 `<canvas>` 以 30fps 的速度绘制，也会捕获 `10fps` 的内容。

## 应用程序窗口或整个屏幕

将应用程序窗口或整个屏幕转换为媒体流，用于录制或通过网络进行共享。

## 参考资料

- [W3C Specification: Media Capture from DOM Elements](https://www.w3.org/TR/mediacapture-fromelement/)
- [W3C Specification: Screen Capture](https://w3c.github.io/mediacapture-screen-share/)
- [Media Capture and Streams API (Media Stream)](https://developer.mozilla.org/en-US/docs/Web/API/Media_Streams_API)
- [Screen Capture API](https://developer.mozilla.org/en-US/docs/Web/API/Screen_Capture_API)
- [Capture a MediaStream From a Canvas, Video or Audio Element](https://developers.google.com/web/updates/2016/10/capture-stream)
- [Using the Screen Capture API](https://developer.mozilla.org/en-US/docs/Web/API/Screen_Capture_API/Using_Screen_Capture)