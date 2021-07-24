# 调用 API 来启用相机和麦克风进行媒体捕获

[示例的线上效果](https://codesandbox.io/s/github/alvinhui/100-Days-Of-WebMedia/tree/main/zh-cn/02_capture/01_camera_and_mike/examples/01_getUserMedia)

## 使用的 API

- [MediaDevices.getUserMedia()](https://developer.mozilla.org/zh-CN/docs/Web/API/MediaDevices/getUserMedia)
- [ImageCapture.takePhoto()](https://developer.mozilla.org/en-US/docs/Web/API/ImageCapture/takePhoto)
- [canvas](https://developer.mozilla.org/zh-CN/docs/Web/API/HTMLCanvasElement)
  - [toDataURL()](https://developer.mozilla.org/en-us/docs/Web/API/HTMLCanvasElement/toDataURL)
  - [CanvasRenderingContext2D.drawImage()](https://developer.mozilla.org/zh-CN/docs/Web/API/CanvasRenderingContext2D/drawImage)
- [video](https://developer.mozilla.org/zh-CN/docs/Web/API/HTMLVideoElement)
- [image](https://developer.mozilla.org/zh-CN/docs/Web/API/HTMLImageElement)
- [MediaStream Recording API](https://developer.mozilla.org/en-US/docs/Web/API/MediaStream_Recording_API)

## 参考资料

- [Taking still photos with WebRTC](https://developer.mozilla.org/zh-CN/docs/Web/API/WebRTC_API/Taking_still_photos)
- [Recording a media element](https://developer.mozilla.org/en-US/docs/Web/API/MediaStream_Recording_API/Recording_a_media_element)