# 捕获音频和画面

本文将介绍如何使用 Web 技术在用户设备上访问其麦克风和摄像头来实时地捕获用户的音频和画面，截取或录制画面，并将媒体内容上传到服务器。 

## 捕获用户画面

先来看看如何捕获用户的画面并将其实时地显示在我们的应用程序上。

首先我们需要一个能够实时显示媒体流的 HTML 元素，最简单的方式就是使用 Video 元素。当然还有别的方式，例如 canvas 元素。但让我们从最简单的开始。

我们使用的 HTML 结构如下：

```html
<div class="main">
  <div class="camera">
    <div>实时画面</div>
    <video id="video">视频流不可用</video>
  </div>
</div>
```

注意我没有给 video 元素设置播放源和控制条，因此在没有任何流输入给它之前，它会是一个白屏画面。为了能够在界面上把它区分出来，我给它添加了一些样式：

```css
#video {
  width: 320px;
  height: 240px;
  border: 1px solid black;
  box-shadow: 2px 2px 3px black;
}
```

### getUserMedia

接下来让我们使用 `getUserMedia` API 来获取用户的媒体输入：

```js
navigator.mediaDevices.getUserMedia(constraints)
  .then(function(stream) {
    /* 使用这个 stream */
  })
  .catch(function(err) {
    /* 处理 error */
  });
```

这首先取决于浏览器是否具备使用摄像头的权限：

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

更多参数可访问：[Properties of video tracks](https://developer.mozilla.org/en-US/docs/Web/API/MediaTrackConstraints#properties_of_video_tracks) 了解。

#### 返回值

`getUserMedia()` 返回一个 Promise ， 这个 Promise 成功后的回调函数带一个 [MediaStream](https://developer.mozilla.org/en-US/docs/Web/API/MediaStream) 对象作为其参数。

而失败的回调函数则带一个 [DOMException](https://developer.mozilla.org/zh-CN/docs/Web/API/DOMException) 对象作为其参数。可能的异常有：

- **AbortError［中止错误］**：尽管用户和操作系统都授予了访问设备硬件的权限，而且未出现 `NotReadableError` 异常，但仍然出现了一些问题导致了设备无法被使用。
- **NotAllowedError［拒绝错误］**：用户拒绝了当前的浏览器的设备访问权限，或者用户拒绝了当前站点的设备访问权限，或者用户在浏览器设置了拒绝所有的设备访问权限；如果页面是使用 HTTP 而不是 HTTPS 加载的，则也会返回此错误；在支持使用[功能策略](https://developer.mozilla.org/en-US/docs/Web/HTTP/Feature_Policy)管理媒体权限的浏览器上，如果功能策略未配置为允许访问输入源，则也会返回此错误。
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
    video.play();
  })
  .catch(function(err) { 
    // 在没有连接兼容的相机，或者用户拒绝访问时，会进入这个逻辑。
    alert('发生了一个错误： ' + err);
  });
```

#### 设置显示效果

```js
// 设置拍摄照片的宽度和高度，这里设置宽度固定值，高度基于输入流的纵横比计算得出。
var width = 320;
var height = 0;

video.addEventListener('canplay', function(ev){
  height = video.videoHeight / (video.videoWidth /  width);
  video.style.width = width + 'px';
  video.style.height = height + 'px';
}, false);
```

## 截取用户画面

...

## 录制用户画面

...

## 上传媒体内容


...