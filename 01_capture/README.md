# 在 Web 上进行拍照

示例演示如何访问设备的摄像头捕获媒体流，然后将媒体流输出到屏幕上。还演示了从视频流中捕获视频帧，将该帧渲染到屏幕上。你可以[访问线上示例](https://codesandbox.io/s/github/alvinhui/100-Days-Of-WebMedia/tree/main/01_capture)来看看效果。

使用的核心 API：

- [MediaDevices.getUserMedia()](https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia)
- [canvas](https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement)
  - [toDataURL()](https://developer.mozilla.org/en-us/docs/Web/API/HTMLCanvasElement/toDataURL)
  - [CanvasRenderingContext2Ds.drawImage()](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/drawImage)
- [video](https://developer.mozilla.org/en-US/docs/Web/API/HTMLVideoElement)
- [image](https://developer.mozilla.org/en-US/docs/Web/API/HTMLImageElement)

参考资料：

- [Taking still photos with WebRTC](https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API/Taking_still_photos)
- [MediaStream Image Capture API](https://developer.mozilla.org/en-US/docs/Web/API/MediaStream_Image_Capture_API)