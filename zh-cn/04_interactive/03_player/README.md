# 定制播放行为

![](https://img.alicdn.com/imgextra/i4/O1CN01ASKxpu1Dz1xqFjg1I_!!6000000000286-2-tps-920-520.png)

在网页中我们可以通过 `<video>` 标签便捷地引入视频内容。但依然存在一些问题，例如：

- 不同的系统平台（iOS、安卓）或不同的浏览器的播放体验是不同的 —— 播放器形态及交互方式存在差异；
- 无法为播放器添加更多的控件 —— 例如是否开启弹窗、是否需要字幕等。

这就是为什么开发者可能需要定制播放器的原因之一，如果希望在网页上为用户创造更好的媒体体验的话。

本文将展示如何通过大量的 Web API 渐进式地增强媒体体验，构建一个包含自定义控件、全屏体验及后台播放能力的移动端播放器。

## 自定义控件

用于创建媒体播放器的 HTML 布局非常简单：一个 `<div>` 根元素包含一个 `<video>` 媒体元素和一个 `<div>` 元素用于存放视频控件。视频控件包括：播放/暂停按钮、全屏按钮、后退和前进按钮，当前和整体播放时间及进度条。

![](https://img.alicdn.com/imgextra/i3/O1CN01UNDNnv1hahOitfcGI_!!6000000004294-2-tps-2506-1410.png)

```html
<div id="videoContainer">
  <video id="video" src="file.mp4"></video>
  <div id="videoControls"></div>
</div>
```

### 获取视频元数据

首先我们获取视频的元数据来设置视频时长、当前时间并初始化进度条。

```diff
<div id="videoContainer">
  <video id="video" src="file.mp4"></video>
  <div id="videoControls">
+   <div id="videoCurrentTime"></div>
+   <div id="videoDuration"></div>
+   <div id="videoProgressBar"></div>
  </div>
</div>
```

```js
video.addEventListener('loadedmetadata', function() {
  videoDuration.textContent = secondsToTimeCode(video.duration);
  videoCurrentTime.textContent = secondsToTimeCode(video.currentTime);
  videoProgressBar.style.transform = `scaleX(${video.currentTime / video.duration})`;
});
// secondsToTimeCode() 函数的作用是将秒数转换为 “hh:mm:ss” 格式的字符串
```

效果如下：

![](https://img.alicdn.com/imgextra/i4/O1CN01JU3Cdn1SecYDlazCT_!!6000000002272-2-tps-1024-768.png)

> 显示视频元数据的媒体播放器

### 播放/暂停

接下来我们添加一个播放/暂停按钮，该按钮可以根据当前的播放状态来决定是要执行播放还是暂停。

```diff
<div id="videoContainer">
  <video id="video" src="file.mp4"></video>
  <div id="videoControls">
+   <button id="playPauseButton"></button>
    <div id="videoCurrentTime"></div>
    <div id="videoDuration"></div>
    <div id="videoProgressBar"></div>
  </div>
</div>
```

```js
playPauseButton.addEventListener('click', function(event) {
  event.stopPropagation();
  if (video.paused) {
    video.play();
  } else {
    video.pause();
  }
});
```

接下来我们通过监听视频的 `play` 和 `pause` 事件来改变视频控件的样式，而不是在 `click` 事件中处理。
这样的好处是当浏览器或其他程序触发视频播放状态变更时，我们的视频控制依然能保持与播放状态的同步。

- 当视频开始播放时，我们向按钮添加 "playing" 样式类来改变按钮状态，并移除视频控件元素的 "visible" 样式类来隐藏视频控件。
- 当视频暂停时，我们将移除按钮的 "playing" 样式类来改变按钮状态，并向视频控件元素添加 "visible" 样式类来显示视频控件。

```js
video.addEventListener('play', function() {
  playPauseButton.classList.add('playing');
  videoControls.classList.remove('visible');
});

video.addEventListener('pause', function() {
  playPauseButton.classList.remove('playing');
  videoControls.classList.add('visible');
});
```

当 video 的 currentTime 属性更改时将触发 timeupdate 事件，我们通过监听该事件来更新自定义控件（如果它们可见）。

```js
video.addEventListener('timeupdate', function() {
  if (videoControls.classList.contains('visible')) {
    videoCurrentTime.textContent = secondsToTimeCode(video.currentTime);
    videoProgressBar.style.transform = `scaleX(${video.currentTime / video.duration})`;
  }
});
```

当视频结束时，我们需要将按钮状态更新为“播放”，将视频当前时间设置回 0 并暂时显示视频控件。

```js
video.addEventListener('ended', function() {
  playPauseButton.classList.remove('playing');
  video.currentTime = 0;
  videoControls.classList.add('visible');
});
```

### 音量控制/静音

...

### 快进和后退

我们继续添加“快进”和“后退”按钮，让用户可以轻松跳过某些内容。

```diff
<div id="videoContainer">
  <video id="video" src="file.mp4"></video>
  <div id="videoControls">
    <button id="playPauseButton"></button>
+   <button id="seekForwardButton"></button>
+   <button id="seekBackwardButton"></button>
    <div id="videoCurrentTime"></div>
    <div id="videoDuration"></div>
    <div id="videoProgressBar"></div>
  </div>
</div>
```

```js
var skipTime = 10; // Time to skip in seconds

seekForwardButton.addEventListener('click', function(event) {
  event.stopPropagation();
  video.currentTime = Math.min(video.currentTime + skipTime, video.duration);
});

seekBackwardButton.addEventListener('click', function(event) {
  event.stopPropagation();
  video.currentTime = Math.max(video.currentTime - skipTime, 0);
});
```

跟播放/暂停按钮一致，这里我们不在 `click` 事件中处理前进后退的样式，而是监听 `seeking` 和 `seeked` 事件来调整视频的亮度。

"seeking" 样式类的实现类似：`filter: brightness(0);`

```js
video.addEventListener('seeking', function() {
  video.classList.add('seeking');
});

video.addEventListener('seeked', function() {
  video.classList.remove('seeking');
});
```

### 进度条

...

## 全屏体验

### 防止自动全屏

### 单击按钮时切换全屏

### 屏幕方向改变时切换全屏

### 单击按钮时横向全屏

### 屏幕方向改变时退出全屏

## 后台播放

### 在页面可见性更改时暂停视频

### 在视频可见性更改时显示/隐藏静音按钮

### 一次只播放一个视频

### 自定义通知栏

## 参考资料

- [Creating a cross-browser video player](https://developer.mozilla.org/en-US/docs/Web/Guide/Audio_and_video_delivery/cross_browser_video_player)
- [Mobile Web Video Playback](https://developers.google.com/web/fundamentals/media/mobile-web-video-playback): 展示如何通过大量 Web API 以渐进的方式增强媒体体验，通过自定义控件、全屏和后台播放来构建简单的移动播放器体验。