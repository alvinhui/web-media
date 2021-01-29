# 在 Web 上进行拍照

可以访问[线上示例](https://codesandbox.io/s/github/alvinhui/100-Days-Of-WebMedia/tree/main/01_capture)来看看效果。

该示例使用的核心 API：

- [MediaDevices.getUserMedia()](https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia)
- [canvas](https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement)
  - [toDataURL()](https://developer.mozilla.org/en-us/docs/Web/API/HTMLCanvasElement/toDataURL)
  - [CanvasRenderingContext2Ds.drawImage()](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/drawImage)
- [video](https://developer.mozilla.org/en-US/docs/Web/API/HTMLVideoElement)
- [image](https://developer.mozilla.org/en-US/docs/Web/API/HTMLImageElement)

同时可参考：

- [MediaStream Image Capture API](https://developer.mozilla.org/en-US/docs/Web/API/MediaStream_Image_Capture_API)