# 获取屏幕内容

从设备屏幕上获取内容是开发多媒体应用需要处理的一个常见场景。这里面包含两种情况，一种是将 Web 应用程序中生成或查看的媒体内容转换为媒体流（用于录制或传输），更常见的是将由任何应用程序或整个屏幕的内容转换成媒体流（用于截图或录屏）。

## 获取 Web 中的媒体内容

将 Web 应用程序中生成或查看的媒体内容转换为媒体流，就是从画布（`<canvas>`）和媒体（`<audio>` 或 `<video>`）元素录制或实时传输媒体流，其应用场景有：

- 从 canvas 中录制或直播游戏：例如为用户提供实时的游戏界面分享功能；

  ![示例](https://img.alicdn.com/imgextra/i1/O1CN01uSKWvQ1LIuSUNxZmr_!!6000000001277-1-tps-960-501.gif)
- 为视频流添加其他内容或特效：例如绿幕、美颜等；

  ![示例](https://img.alicdn.com/imgextra/i1/O1CN01cGf9Yz1y0NRnxBmx2_!!6000000006516-0-tps-281-500.jpg)
  > 图片来源：[视频美颜助手app](http://www.87g.com/az/58890.html)
- 使用 canvas 用多个视频实现画中画效果：例如视频通话时的小窗口；

  ![示例](https://img.alicdn.com/imgextra/i2/O1CN01qs3fMu1cSO7exFnaK_!!6000000003599-0-tps-800-390.jpg_790x10000)
  > 图片来源：[《iOS13新增FaceTime通话注视感知校正功能，视频通话更自然》](http://iphone.poppur.com/Apps/9349.html)
- 在 canvas 中合并视频和图像；

Web 应用程序可以通过对网页上的画布和媒体元素调用 `captureStream()` 方法来实现这些效果。该方法使得来自画布和媒体元素中的任何视频或音频流都能够通过 WebRTC 进行录制或直播，又或者放到 `<canvas>` 中与特效或其他媒体流相结合。

`captureStream()` API 的使用方式非常简单：

1. 从 canvas 元素获取媒体流：

    ```js
    var canvas = document.querySelector('canvas');
    var video = document.querySelector('video');

    // 每秒帧数参数是可选的。
    var stream = canvas.captureStream(25);

    // 将 video 元素的源设置为 canvas 中的流
    video.srcObject = stream;
    ```
2. 从 video 元素获取媒体流：

    ```js
    var leftVideo = document.getElementById('leftVideo');
    var rightVideo = document.getElementById('rightVideo');

    leftVideo.onplay = function() {
      // 将一个 video 元素的源设置为另一个 video 元素的流
      var stream = leftVideo.captureStream();
      rightVideo.srcObject = stream;
    };
    ```

> `captureStream()` 只能在视频元素能够播放视频后调用，这就是为什么我们在 onplay 处理程序中的调用的原因。

### 小提示

- 尝试对通过[加密媒体扩展](http://www.html5rocks.com/en/tutorials/eme/basics/)实现内容保护的媒体元素使用 `captureStream()` 将引发异常。
- 调用 `captureStream()` 从 `<canvas>` 获取时可以设置最大帧速率。例如，`canvas.captureStream(10)` 意味着 canvas 输出在 0 到 10fps 之间。如果在 `<canvas>` 上没有绘制任何内容，则不会获取任何内容。即使 `<canvas>` 以 30fps 的速度绘制，也会获取 `10fps` 的内容。

## 获取屏幕上的内容

更常见的场景是获取应用程序窗口或整个屏幕上的内容，转换为媒体流，用于录制或通过网络进行共享。

例如，可以在一个会议服务应用程序中共享演讲者的演示文稿，又或者为远程控制工具（例如 [Chrome remote Desktop](https://remotedesktop.google.com/)）向负责控制的计算机提供受控计算机的屏幕图像。

### 如何获取

Web 应用程序可以通过调用 `navigator.mediaDevices.getDisplayMedia()` 方法来将屏幕内容转换为实时的 [MediaStream](https://developer.mozilla.org/en-US/docs/Web/API/MediaStream)，该方法将返回一个 `Promise`，包含实时屏幕内容的流数据：

```js
navigator.mediaDevices.getDisplayMedia()
  .catch(err => { console.error(err); return null; });
```

终端用户需要为浏览器授予计算机的屏幕录制权限，该方法才能调用成功。否则该方法将返回一个 NotAllowedError 错误，除此之外还有其他一些[可能的错误情况](https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getDisplayMedia#exceptions)。

![](https://img.alicdn.com/imgextra/i1/O1CN016zSo0e1VQN4STjqrK_!!6000000002647-2-tps-668-573.png)

调用成功后，浏览器将弹出一个用户界面来提示用户选择要共享的屏幕区域。可以选择的区域范围有整个屏幕、某个应用程序的窗口或浏览器上的某个标签：

![示例](https://img.alicdn.com/imgextra/i1/O1CN01Ct3VWs1dtExpqVEza_!!6000000003793-2-tps-608-500.png)

当获取内容生效时，正在共享屏幕内容的浏览器将以某种显式的方式来让用户知道共享正在发生。例如 Chrome 浏览器：

![](https://img.alicdn.com/imgextra/i1/O1CN01ZpzgUu22qpGk0uGwB_!!6000000007172-2-tps-492-294.png)

#### 选项

`getDisplayMedia()` 方法可以接收一个 [DisplayMediaStreamConstraints](https://developer.mozilla.org/en-US/docs/Web/API/DisplayMediaStreamConstraints) 对象用于配置获取到的媒体流。

DisplayMediaStreamConstraints 对象用于指定在返回的媒体流中是否包含视频或音频流，以及如何对其进行处理。对于音频或视频流的处理配置是通过 [MediaTrackConstraints](https://developer.mozilla.org/en-US/docs/Web/API/MediaTrackConstraints) 对象指定的：

```ts
interface DisplayMediaStreamConstraints {
  video?: boolean | MediaTrackConstraints;
  audio?: boolean | MediaTrackConstraints;
}
function getDisplayMedia(options?: DisplayMediaStreamConstraints): Promise<MediaStream>;
```

选项只会应用于获取到的媒体流结果，对选择屏幕区域的弹窗和获取的过程没有约束。

例如，如果用 `width` 选项指定视频流的配置，则在用户选择要共享的区域后将通过缩放视频来应用它，它没有对源本身的大小设置限制:

```js
navigator.mediaDevices.getDisplayMedia({ video: { width: 200 } })
```

#### 获取音频

还可以与视频内容一起获取音频。音频的来源可能是选定的窗口、整个计算机的音频系统或用户的麦克风（或以上所有）。

要获取音频，通过调用 `getDisplayMedia()` 方法时指定 audio 参数来实现：

```js
navigator.mediaDevices.getDisplayMedia({ video: true, audio: true })
```

还可以通过传入 `MediaTrackConstraints` 来指定对音频的配置。下面的示例指定音频启用噪声抑制和回声消除功能，以及理想的 44.1kHz 音频采样率：

```js
navigator.mediaDevices.getDisplayMedia({ 
  video: true, 
  audio: {
    echoCancellation: true,
    noiseSuppression: true,
    sampleRate: 44100
  } 
})
```

### 安全策略

[Web 功能策略](https://developer.mozilla.org/en-US/docs/Web/HTTP/Feature_Policy) 允许开发人员有选择地启用、禁用和修改浏览器中某些功能和 API 的行为。它类似于[内容安全策略](https://developer.mozilla.org/en-US/docs/Glossary/CSP)，但控制功能而不是安全行为。

我们可以通过指定 `display-capture` 配置来限定 Web 应用是否可以使用获取屏幕功能 —— 通过 HTTP 响应头来指定或 iframe 的 allow 属性来实现。

例如，下面这个 HTTP 响应头允许当前网页和其加载的任何同源 `<iframe>` 使用获取屏幕功能：

```
Feature-Policy: display-capture 'self'
```

如果是在 iframe 中使用屏幕获取功能，则可以在嵌入 iframe 时进行指定，这样的权限控制将更加安全：

```html
<iframe src="https://mycode.example.net/etc" allow="display-capture"></iframe>
```

### 示例 

接下来我们通过一个示例来演示如何获取用户的屏幕内容并显示在 Web 应用内。下面是这个示例的最终效果：

![](https://img.alicdn.com/imgextra/i2/O1CN01X4CrkP1jlLpvDavjW_!!6000000004588-2-tps-887-855.png_790x10000)

可以看到这个示例由三个部分组成：

1. 操作区：允许用户通过启动按钮主动发起获取屏幕内容的操作
2. 内容显示区：将获取到的屏幕内容将显示到这里
3. 日志区：如果获取屏幕内容程序启动成功，将输出对视频流的约束和设置，如果失败则显示错误信息

#### HTML

首先实现 HTML 部分：

```html
<div>
  <p>
    将在下面的区域显示获取到的用户屏幕内容。
  </p>
  <div>
    <button id="start">
      开始获取
    </button>
    <button id="stop">
      停止获取
    </button>
  </div>
  <br />
  <video id="video" autoplay></video>
  <div>
    <strong>日志：</strong>
    <br />
    <pre id="log"></pre>
  </div>
</div>
```

1. 通过两个 [button](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button) 元素来允许用户来开始和终止屏幕内容的获取
2. 获取到的媒体流将输出给 [video](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/video) 元素进行显示
3. 用 pre 元素来显示操作结果

#### CSS

接下来实现 CSS 部分，视频区添加边框加以区分，`error` 和 `info` 是应用于日志区的文本样式。

```css
#video {
  border: 1px solid #999;
  width: 98%;
  max-width: 860px;
}
.error {
  color: red;
}
.info {
  color: green;
}
```

#### JavaScript

最后来实现获取屏幕内容的核心 JavaScript 部分代码。

声明常量来引用页面上的元素：

```js
const videoElem = document.getElementById('video');
const logElem = document.getElementById('log');
const startElem = document.getElementById('start');
const stopElem = document.getElementById('stop');
```

为 start 和 stop 按钮添加点击事件监听：

```js
startElem.addEventListener('click', startCapture, false);
stopElem.addEventListener('click', stopCapture, false);
```

添加日志函数，将日志函数的内容输出到 pre 元素上：

```js
const error = msg => logElem.innerHTML += `<span class="error">${msg}</span><br>`;
const info = msg => logElem.innerHTML += `<span class="info">${msg}</span><br>`;
```

实现开始获取屏幕内容程序：

```js
async function startCapture() {
  // 每次启动获取屏幕程序都将使用全新的日志
  logElem.innerHTML = '';

  try {
    const displayMediaOptions = {
      video: {
        cursor: 'always',
      },
      audio: true
    };
    // 必须使用异步的方式调用 getDisplayMedia
    // 因为需要等待用户的选择确认授权
    const mediaStream = await navigator.mediaDevices.getDisplayMedia(displayMediaOptions);

    // 获取到的媒体流通过视频元素进行实时显示
    videoElem.srcObject = mediaStream;

    // 将相关流的信息输出到日志框
    dumpOptionsInfo();
  } catch(err) {
    // 如果获取失败，则显示错误信息
    error('Error: ' + err);
  }
}
```

停止获取屏幕内容：

```js
function stopCapture() {
  // 获取当前视频元素的所有媒体轨道
  const tracks = videoElem.srcObject.getTracks();

  // 停止媒体轨道的流获取
  tracks.forEach(track => track.stop());

  // 销毁媒体流对象
  videoElem.srcObject = null;
}
```

显示媒体流信息：

```js
function dumpOptionsInfo() {
  const videoTrack = videoElem.srcObject.getVideoTracks()[0];
  info('Track settings:');
  info(JSON.stringify(videoTrack.getSettings(), null, 2));
  info('Track constraints:');
  info(JSON.stringify(videoTrack.getConstraints(), null, 2));
}
```

使用 [getSettings()](https://developer.mozilla.org/en-US/docs/Web/API/MediaStreamTrack/getSettings) 方法获取当前视频流的设置，以及使用 [getConstraints()](https://developer.mozilla.org/en-US/docs/Web/API/MediaStreamTrack/getConstraints) 来获取视频流的约束。

关于 Settings 和 Constraints 可参考[《功能、约束和设置》](https://developer.mozilla.org/en-US/docs/Web/API/Media_Streams_API/Constraints)。

完整的示例代码可以在 [Github 上找到](https://github.com/alvinhui/web-media/tree/main/zh-cn/02_capture/02_screen_capture/examples/02_getDisplayMedia)。

## 参考资料

- [W3C Specification: Media Capture from DOM Elements](https://www.w3.org/TR/mediacapture-fromelement/)
- [W3C Specification: Screen Capture](https://w3c.github.io/mediacapture-screen-share/)
- [Media Capture and Streams API (Media Stream)](https://developer.mozilla.org/en-US/docs/Web/API/Media_Streams_API)
- [Screen Capture API](https://developer.mozilla.org/en-US/docs/Web/API/Screen_Capture_API)
- [Capture a MediaStream From a Canvas, Video or Audio Element](https://developers.google.com/web/updates/2016/10/capture-stream)
- [Using the Screen Capture API](https://developer.mozilla.org/en-US/docs/Web/API/Screen_Capture_API/Using_Screen_Capture)