# 捕获音频和画面

本文将介绍如何使用 Web 技术在用户设备上访问其麦克风和摄像头来实时地捕获用户的音频和画面，截取或录制画面，并将媒体内容上传到服务器。 

下图是最终实现的效果演示：

![](https://img.alicdn.com/imgextra/i1/O1CN01P854oc1HQ08vnybHh_!!6000000000751-2-tps-1058-518.png)

## 目录

- [捕获用户画面](#捕获用户画面)
- [截取用户画面](#截取用户画面)
- [录制用户画面](#录制用户画面)
- [上传媒体内容](#上传媒体内容)

## 捕获用户画面

先来看看如何捕获用户的画面并将其实时地显示在我们的应用程序上。

首先我们需要一个能够实时显示媒体流的 HTML 元素，将从输入设备获取到的媒体流输出到页面。
最简单的方式就是使用 video 元素。当然还有别的方式，例如 canvas 元素。但让我们从最简单的开始。

我们使用的 HTML 结构如下：

```html
<div class="main">
  <div class="camera">
    <div>实时画面</div>
    <video id="video">视频流不可用</video>
  </div>
</div>
```

注意我没有给 video 元素设置播放源和控制条，因此在没有任何流输入给它之前，它会是一个白屏画面。
为了能够在界面上把它区分出来，我给它添加了一些样式：

```css
#video {
  width: 320px;
  height: 240px;
  border: 1px solid black;
  box-shadow: 2px 2px 3px black;
}
```

### getUserMedia

接下来让我们使用 [`MediaDevices.getUserMedia()`](https://developer.mozilla.org/zh-CN/docs/Web/API/MediaDevices/getUserMedia) API 来获取用户的媒体输入：

```js
navigator.mediaDevices.getUserMedia(constraints)
  .then(function(stream) {
    /* 使用这个 stream */
  })
  .catch(function(err) {
    /* 处理 error */
  });
```

#### 权限

`getUserMedia` 能否调用成功首先取决于浏览器是否具备使用摄像头的权限：

![](https://img.alicdn.com/imgextra/i1/O1CN016cFauH1EQ3KxiF2ep_!!6000000000345-2-tps-668-573.png)

如果浏览器已经具备该权限，则会提示用户是否授予网站使用该权限（提示形式取决于浏览器）：

![](https://img.alicdn.com/imgextra/i1/O1CN01VrzuOe1xZoUEf3S9C_!!6000000006458-2-tps-482-186.png)

#### 参数

`getUserMedia` 接受一个 [MediaStreamConstraints](https://developer.mozilla.org/en-US/docs/Web/API/MediaStreamConstraints) 对象作为参数，下面的用法指明了请求用户的音频（麦克风）和视频（摄像头）：

```js
{video: true, audio: true}
```

如果为某种媒体类型设置了 `true` ，返回的结果流中就需要有此种类型。如果其中一个由于某种原因无法获得，`getUserMedia()` 就会抛出错误。

还可以使用额外的 constraints 参数请求想要的摄像头和麦克风能力。下面的示例代码表示想要使用 1280x720 的摄像头分辨率：

```js
{
  audio: true,
  video: { width: 1280, height: 720 }
}
```

浏览器会试着满足这个请求参数，但是如果无法准确满足此请求中的参数要求，则会返回其它的分辨率而不会抛错。
强制要求获取特定的分辨率时，可以使用 `min` / `max` 关键字。以下参数表示要求获取最低为 1280x720 的分辨率：

```js
{
  audio: true,
  video: {
    width: { min: 1280 },
    height: { min: 720 }
  }
}
```

如果摄像头不支持请求的分辨率，则 `getUserMedia()` 将会抛出一个 `NotFoundError` 的错误。

两种不同的传参造成不同表现的原因是，相对于简单的数字字面量而言，关键字 `min`, `max` 表达的是一种强制性的范围，请看一个更详细的例子：

```js
{
  audio: true,
  video: {
    width: { min: 1024, ideal: 1280, max: 1920 },
    height: { min: 776, ideal: 720, max: 1080 }
  }
}
```

当请求包含一个 `ideal`（应用最理想的）值时，这个值有着更高的权重。意味着浏览器会先尝试找到最接近指定的理想值的设定或者摄像头（如果设备拥有不止一个摄像头）。

简单的数值字面量可以理解为是应用理想的值，因此下面两种传参形式是等价的：

1. 使用 `ideal` 关键字：

  ```js
  {
    audio: true,
    video: {
      width: { ideal: 1280 },
      height: { ideal: 720 }
    }
  }
  ```
2. 使用数字字面量：

  ```js
  {
    audio: true,
    video: {
      width: 1280,
      height: 720
    }
  }
  ```

还有另外一些视频流相关的参数可以使用，在移动设备上面，优先使用前置摄像头：

```js
{ audio: true, video: { facingMode: 'user' } }
```

更多参数可访问：[Properties of video tracks](https://developer.mozilla.org/zh-CN/docs/Web/API/MediaTrackConstraints#properties_of_video_tracks) 了解。

#### 返回值

`getUserMedia()` 返回一个 Promise ， 这个 Promise 成功后的回调函数带一个 [MediaStream](https://developer.mozilla.org/zh-CN/docs/Web/API/MediaStream) 对象作为其参数。

而失败的回调函数则带一个 [DOMException](https://developer.mozilla.org/zh-CN/docs/Web/API/DOMException) 对象作为其参数。可能的异常有：

- **AbortError［中止错误］**：尽管用户和操作系统都授予了访问设备硬件的权限，而且未出现 `NotReadableError` 异常，但仍然出现了一些问题导致了设备无法被使用。
- **NotAllowedError［拒绝错误］**：用户拒绝了当前的浏览器的设备访问权限，或者用户拒绝了当前站点的设备访问权限，或者用户在浏览器设置了拒绝所有的设备访问权限；如果页面是使用 HTTP 而不是 HTTPS 加载的，则也会返回此错误；在支持使用[功能策略](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Feature_Policy)管理媒体权限的浏览器上，如果功能策略未配置为允许访问输入源，则也会返回此错误。
- **NotFoundError［找不到错误］**：找不到满足请求参数的媒体设备类型。
- **NotReadableError［无法读取错误］**：尽管用户已经授权使用相应的设备，操作系统上某个硬件、浏览器或者网页层面发生的错误导致设备无法被访问。
- **OverConstrainedError［无法满足要求错误］**：指定的要求无法被设备满足，此异常是一个类型为 `OverconstrainedError` 的对象，拥有一个 `constraint` 属性，这个属性包含了当前无法被满足的 `constraint` 对象，还拥有一个 `message` 属性包含了用来说明情况。
- **TypeError［类型错误］**：`constraints` 对象未设置，或者都被设置为 `false`。

### 示例

#### 捕获媒体流并显示

```js
var video = document.getElementById('video');
navigator.mediaDevices.getUserMedia({video: true, audio: true})
  .then(function(stream) {
    // 将获取到媒体流作为视频元素的媒体源
    video.srcObject = stream; 

    // 流被链接到 video 元素后，调用 video 元素的 play 方法开始播放
    video.play();
  })
  .catch(function(err) { 
    // 调用失败回调函数，通常是没有找到输入设备，或者用户拒绝访问时会进入该逻辑
    alert('发生了一个错误： ' + err);
  });
```

> 参考：[`HTMLMediaElement.play()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/play)

#### 设置显示效果

视频元素加载元数据之后，通过输入流的宽高比设置其显示外观。

```js
var width = 320; // 无论输入视频的尺寸如何，我们将把所得到的图像缩放到 320 像素宽
var height = 0;

video.addEventListener('loadedmetadata', function(ev){
  // 根据给定流的实际和显示区域的宽度比来设置高度
  height = video.videoHeight / (video.videoWidth /  width);

  // 设置显示的宽度和高度
  video.style.width = width + 'px';
  video.style.height = height + 'px';
}, false);
```

> - 参考：[`HTMLVideoElement.videoHeight`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLVideoElement/videoHeight)
> - 参考：[`HTMLMediaElement: loadedmetadata event`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/loadedmetadata_event)

#### 最终效果

![](https://img.alicdn.com/imgextra/i3/O1CN01ccYnI11Nxn3SYfDVG_!!6000000001637-1-tps-786-560.gif)

## 截取用户画面

现在我们已经获得了用户的输入设备的媒体流并用 video 元素显示在了用户的显示设备上。
接下来看看如何截取用户的静态画面，也就是我们常说的「截图」功能。

这需要利用到 [canvas](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/canvas) 元素。

让我们在原有的示例上继续添加一些元素来实现该功能：用于触发截图的 button 按钮、截取视频帧的 canvas 元素、显示截取图像的 img 元素。

```diff
<div class="main">
  <div class="camera">
    <div>实时画面</div>
    <video id="video">视频流不可用</video>
+   <div class="opts">
+     <button id="screenshotButton">截图</button>
+   </div>
  </div>
+ <canvas id="canvas"></canvas>
+ <div class="output">
+   <div>截图结果</div>
+   <img id="img" alt="截取到的图像将显示在这里" /> 
+ </div>
</div>
```

canvas 是辅助实现截图功能的中间元素，不需要显示在界面上，应用下面的样式来隐藏它：

```css
#canvas {
  display: none;
}
```

然后我们需要设置 canvas 和 img 的显示宽高，让其和视频的显示宽高保持一致，避免畸变：

```diff
+var img = document.getElementById('img');
+var canvas = document.getElementById('canvas');
video.addEventListener('loadedmetadata', function(ev){
+ canvas.width = width;
+ canvas.height = height;
+ img.style.width = width + 'px';
+ img.style.height = height + 'px';
}, false);
```

最后给截图按钮添加点击事件，在响应函数中捕获当前的视频帧并通过 img 元素显示：

```js
document.getElementById('screenshotButton').addEventListener('click', function(ev){
  const ctx = canvas.getContext('2d');
  ctx.drawImage(video, 0, 0, width, height);
  img.src = canvas.toDataURL('image/png');
}, false);
```

这是程序实现的重点部分。首先通过调用 [HTMLCanvasElement](https://developer.mozilla.org/zh-CN/docs/Web/API/HTMLCanvasElement) 的 [`getContext()`](https://developer.mozilla.org/zh-CN/docs/Web/API/HTMLCanvasElement/getContext) 方法，传入 2d 参数建立一个 [CanvasRenderingContext2D](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D) 二维渲染上下文。CanvasRenderingContext2D 可为 canvas 元素的绘图表面提供 2D 渲染，用于绘制形状，文本，图像和其他对象。

然后调用 [`CanvasRenderingContext2D.drawImage()`](https://developer.mozilla.org/zh-CN/docs/Web/API/CanvasRenderingContext2D/drawImage) 方法来绘制图像，该方法可以接受多种参数形态以多种方式在 canvas 元素上绘制图像。我们使用到的是方式是：`ctx.drawImage(image, dx, dy, dWidth, dHeight);`，其参数含义和传入值如下：

- `image`：绘制到上下文的元素。允许任何的 canvas [图像源](https://developer.mozilla.org/zh-CN/docs/Web/API/CanvasImageSource)，例如：[HTMLImageEleme](https://developer.mozilla.org/zh-CN/docs/Web/API/HTMLImageElement)、[HTMLVideoElement](https://developer.mozilla.org/zh-CN/docs/Web/API/HTMLVideoElement)、[ImageBitmap](https://developer.mozilla.org/zh-CN/docs/Web/API/ImageBitmap) 等等，在我们的示例中传入的是 HTMLVideoElement；
- `dx`：video 的左上角在目标 canvas 上 X 轴坐标，示例中传入的值是 0，意味着在 canvas 的最左侧显示图像；
- `dy`：video 的左上角在目标 canvas 上 Y 轴坐标，示例中传入的值是 0，意味着在 canvas 的最上方显示图像；
- `dWidth`：video 在目标 canvas 上绘制的宽度。允许对绘制的 video 进行缩放。如果不说明，在绘制时 video 宽度不会缩放；
- `dHeight`：video 在目标 canvas 上绘制的高度。允许对绘制的 video 进行缩放。如果不说明，在绘制时 video 高度不会缩放。

![](https://img.alicdn.com/imgextra/i3/O1CN011pXSUp29EXTi1aLQC_!!6000000008036-0-tps-300-290.jpg)

通过调用该方法，我们将 video 元素的**当前播放帧**绘制到了 canvas 的 2D 上下文中，用帧图像填充了整个画布。

一旦画布包含捕获的图像，我们通过调用 [`HTMLCanvasElement.toDataURL()`](https://developer.mozilla.org/zh-CN/docs/Web/API/HTMLCanvasElement/toDataURL) 返回一个包含 [PNG](https://en.wikipedia.org/wiki/Portable_Network_Graphics) 格式图像的 [data URI](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Basics_of_HTTP/Data_URIs)。

最后通过调用 [`HTMLImageElement.src`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLImageElement/src) API 将该 data URL 设置为 img 元素的源，由此将截取到的图像显示在界面上。

代码最终的实现效果：

![](https://img.alicdn.com/imgextra/i2/O1CN01zMtT1v1LxfieeAZ23_!!6000000001366-1-tps-786-560.gif)

## 录制用户画面

除了静态画面，我们还可以截取用户的动态画面，也就是常说的「录制」功能。

让我们在原有的示例上继续添加一些元素来实现该功能：用于触发录制的 button 按钮、显示录制结果的 video 元素、用于下载录制结果到本地的 button 按钮。

```diff
<div class="main">
  <div class="camera">
    <div>实时画面</div>
    <video id="video">视频流不可用</video>
    <div class="opts">
      <button id="screenshotButton">截图</button>
+     <button id="recordButton">录制</button>
    </div>
  </div>
  <canvas id="canvas"></canvas>
  <div class="output">
    <div>截图结果</div>
    <img id="photo" alt="截取到的图像将显示在这里" /> 
  </div>
+ <div class="output">
+   <div>录制结果</div>
+   <video id="recording" controls></video>
+   <div class="opts">
+     <a id="downloadButton" download="test.webm">下载视频</a>
+   </div>
+ </div>
</div>
```

脚本部分，首先监听录制按钮的点击事件，根据按钮的状态决定开始录制还是结束录制：

```js
var recordButton = document.getElementById('recordButton');
recordButton.addEventListener('click', function() {
  if (recordButton.textContent === '录制') {
    startRecording();
  } else {
    stopRecording();
  }
}, false);
```

`startRecording` 函数是录制逻辑的实现。需要使用到进行媒体录制的 [MediaRecorder API](https://developer.mozilla.org/zh-CN/docs/Web/API/MediaRecorder)，通过调用 `MediaRecorder()` 构造方法进行实例化，构造函数会创建一个对指定的 `MediaStream` 对象进行录制 `MediaRecorder` 对象。

在我们前面的示例中，已经捕获到了用户的媒体输入并通过 video 元素来进行显示。在这里我们只需要调用 [`video.captureStream()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/captureStream) 方法来获取 MediaStream 对象，该对象包含 video 元素上实时流式传输的媒体内容。

```js
var mediaStream = video.captureStream();
var mediaRecorder = new MediaRecorder(mediaStream);
```

通过监听该对象的 [`dataavailavle`](https://developer.mozilla.org/en-US/docs/Web/API/MediaRecorder/ondataavailable) 方法来获取录制数据，当 MediaRecorder 获取到媒体数据以供使用时将触发该事件，数据通过 [Blob](https://developer.mozilla.org/zh-CN/docs/Web/API/Blob) 对象提供。具体来说，以下几种情况会触发该事件：

1. 媒体流结束时，所有尚未传递到 ondataavailable 处理程序的媒体数据都将在单个 Blob 中传递；
2. 调用 `MediaRecorder.stop()` 时，自记录开始或 `dataavailable` 事件最后一次发生以来已捕获的所有媒体数据都将传递到 `Blob` 中，然后录制结束；
3. 调用 `MediaRecorder.requestData()` 时，将传递自记录开始或 `dataavailable` 事件最后一次发生以来捕获的所有媒体数据；然后 MediaRecorder 会创建一个新的 Blob 对象，并将媒体录制继续存储到该 Blob 中；
4. 如果将 `timeslice` 属性传递到开始媒体捕获的 `MediaRecorder.start()` 方法中，`dataavailable` 事件则将每 `timeslice` 毫秒触发一次事件。

```js
var recordedBlobs = [];
mediaRecorder.ondataavailable = function(event) {
  if (event.data && event.data.size > 0) {
    recordedBlobs.push(event.data);
  }
};
```

一旦录制结束，则将获取到的媒体数据放入事先准备好用于显示录制结果的 video 元素，同时设置下载按钮的超链接：

```js
mediaRecorder.onstop = function() {
  if (recordedBlobs.length) {
    // 将多个 Blob 合并到一个 Blob 对象中，以便后续进行处理
    var superBlob = new Blob(recordedBlobs);
    // 为 Blob 对象创建一个可访问的 URL
    var objectURL = URL.createObjectURL(superBlob);
    // 设置显示元素和下载按钮
    recording.src = objectURL;
    downloadButton.href = objectURL;
  }
};
```

> 参考 [`URL.createObjectURL()`](https://developer.mozilla.org/zh-CN/docs/Web/API/URL/createObjectURL)

然后马上调用 [`mediaRecorder.start()`](https://developer.mozilla.org/en-US/docs/Web/API/MediaRecorder/start) 方法来启动录制。

将上面的所有示例代码放到一起，就是下面的 `startRecording` 函数完整实现：

```js
var downloadButton = document.getElementById('downloadButton');
var mediaRecorder;
function startRecording() {
  recordButton.textContent = '停止';
  downloadButton.removeAttribute('href');
  
  var recordedBlobs = [];
  var mediaStream = video.captureStream();
  mediaRecorder = new MediaRecorder(mediaStream);
  mediaRecorder.ondataavailable = function(event) {
    if (event.data && event.data.size > 0) {
      recordedBlobs.push(event.data);
    }
  };
  mediaRecorder.onstop = function() {
    if (recordedBlobs.length) {
      var superBlob = new Blob(recordedBlobs);
      var objectURL = URL.createObjectURL(superBlob);
      recording.src = objectURL;
      downloadButton.href = objectURL;
      downloadButton.download = 'test.webm';
    }
  };
  mediaRecorder.start();
}
```

最后让我们来实现 `stopRecording` 方法以完成整个程序：

```js
function stopRecording() {
  mediaRecorder && mediaRecorder.stop();
  recordButton.textContent = '录制';
}
```

代码最终的实现效果：

![](https://img.alicdn.com/imgextra/i1/O1CN01GlcAy51tKv9GkaYz6_!!6000000005884-1-tps-1076-626.gif)

## 上传媒体内容

上面我们都是在使用 Web API 调用的方式来启用设备的媒体捕获能力。还有一种方式是从文件上传控件中声明性地请求使用媒体捕获能力来实时地捕获媒体内容。

一种常见的应用场景是上传用户头像。比方类似下面这样的表单中的 "Profile picture" 字段：

![](https://img.alicdn.com/imgextra/i2/O1CN01MgV2mU1OqIC3zyLFi_!!6000000001756-2-tps-746-358.png)

当一个 `input` 元素的 `type` 属性为 `file`，并且它的 `accept` 属性被指定时，则可以通过 [`capture`](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/capture) 属性来指定启用媒体捕获能力。

例如，当一个 `input` 元素的 `accept` 属性设置为 `image/*` 并且 `capture` 属性被指定时，文件选择器可以呈现如下所示：

![](https://img.alicdn.com/imgextra/i1/O1CN01Hu4PEV1J1qUQjCdSM_!!6000000000969-2-tps-520-404.png)

下面来看一些代码示例。

- 要使用设备的前置摄像头拍摄照片，并上传使用 HTML 表单上传拍摄到的照片：

  ```html
  <form action="server.cgi" method="post" enctype="multipart/form-data">
    <input type="file" name="image" accept="image/*" capture="user">
    <input type="submit" value="Upload">
  </form>
  ```
- 或者使用设备的后置摄像头捕获视频：

  ```html
  <form action="server.cgi" method="post" enctype="multipart/form-data">
    <input type="file" name="video" accept="video/*" capture="environment">
    <input type="submit" value="Upload">
  </form>
  ```
- 又或者使用设备的本地麦克风捕获音频：

  ```html
  <form action="server.cgi" method="post" enctype="multipart/form-data">
    <input type="file" name="audio" accept="audio/*" capture>
    <input type="submit" value="Upload">
  </form>
  ```
- 对于更高级的用例，可以指定 capture 属性：

  ```html
  <input type="file" accept="image/*" capture>
  <canvas></canvas>
  ```

  然后在脚本中通过 XMLHttpRequest 来处理文件上传：

  ```js
  var input = document.querySelector('input[type=file]');

  input.onchange = function () {
    var file = input.files[0];

    upload(file);
    drawOnCanvas(file); 
    displayAsImage(file);
  };

  function upload(file) {
    var form = new FormData(),
        xhr = new XMLHttpRequest();

    form.append('image', file);
    xhr.open('post', 'server.php', true);
    xhr.send(form);
  }
  ```

  图像也可以在客户端显示而无需上传，例如用于客户端编辑图像的目的。使用 [`FileReader`](https://developer.mozilla.org/en-US/docs/Web/API/FileReader) 和 `canvas` 元素来实现：

  ```js
  function drawOnCanvas(file) {
    var reader = new FileReader();

    reader.onload = function (e) {
      var dataURL = e.target.result,
          c = document.querySelector('canvas'), 
          ctx = c.getContext('2d'),
          img = new Image();

      img.onload = function() {
        c.width = img.width;
        c.height = img.height;
        ctx.drawImage(img, 0, 0);
      };

      img.src = dataURL;
    };

    reader.readAsDataURL(file);
  }
  ```

  或者，只显示图像，使用 [`createObjectURL()`](https://developer.mozilla.org/en-US/docs/Web/API/URL/createObjectURL) 方法和 `img` 元素来实现：

  ```js
  function displayAsImage(file) {
    var imgURL = URL.createObjectURL(file),
        img = document.createElement('img');

    img.onload = function() {
      URL.revokeObjectURL(imgURL);
    };

    img.src = imgURL;
    document.body.appendChild(img);
  }
  ```