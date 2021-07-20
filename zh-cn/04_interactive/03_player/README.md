# 定制播放控件

![播放器演示效果](https://img.alicdn.com/imgextra/i4/O1CN01ASKxpu1Dz1xqFjg1I_!!6000000000286-2-tps-920-520.png)

在网页中我们可以通过 `<video>` 标签便捷地引入视频内容。但依然存在一些问题，例如：

- 不同的系统平台（iOS、安卓）或不同的浏览器的播放体验是不同的 —— 它们所提供的播放器形态及交互方式存在差异；
- 无法为播放器添加更多的控件 —— 例如是否开启弹窗、是否需要字幕等等。

这就是为什么开发者可能需要定制播放器的原因之一，如果希望在网页上为用户创造更好的媒体体验的话。

本文将展示如何渐进式地增强媒体体验，构建一个包含自定义控件、全屏体验及后台播放能力的移动端播放器。

## 目录

- [定制播放控件](#定制播放控件)
  - [目录](#目录)
  - [自定义控件](#自定义控件)
    - [获取视频元数据](#获取视频元数据)
    - [播放/暂停](#播放暂停)
    - [快进和后退](#快进和后退)
    - [进度条](#进度条)
  - [全屏体验](#全屏体验)
    - [防止自动全屏](#防止自动全屏)
    - [单击按钮切换全屏](#单击按钮切换全屏)
    - [屏幕方向改变自动切换全屏](#屏幕方向改变自动切换全屏)
    - [锁定横向全屏](#锁定横向全屏)
    - [屏幕方向改变时退出全屏](#屏幕方向改变时退出全屏)
  - [后台播放](#后台播放)
    - [页面不可见时暂停视频](#页面不可见时暂停视频)
    - [视频可见性更改时显示或隐藏静音按钮](#视频可见性更改时显示或隐藏静音按钮)
    - [一次只播放一个视频](#一次只播放一个视频)
  - [参考资料](#参考资料)

## 自定义控件

用于创建我们的自定义控件媒体播放器的 HTML 布局非常简单：一个 `<div>` 根元素包裹着一个 `<video>` 媒体元素和一个用于存放视频控件 `<div>` 元素。
我们要自定义的视频控件包括：播放/暂停按钮、全屏按钮、后退和前进按钮，视频时长和当前播放时间、进度条。

```html
<div id="videoContainer">
  <video id="video" src="file.mp4"></video>
  <div id="videoControls"></div>
</div>
```

![HTML 布局示意](https://img.alicdn.com/imgextra/i3/O1CN01UNDNnv1hahOitfcGI_!!6000000004294-2-tps-2506-1410.png)

### 获取视频元数据

首先我们获取视频的元数据来设置视频时长、当前播放时间及进度条。

```diff
<div id="videoContainer">
  <video id="video" src="file.mp4"></video>
  <div id="videoControls">
+   <div id="videoCurrentTime"></div>
+   <div id="videoDuration"></div>
+   <progress id="videoProgressWrap" value="0">
+     <span id="progressBar"></span>
+   </progress>
  </div>
</div>
```

```js
video.addEventListener('loadedmetadata', function() {
  videoDuration.textContent = secondsToTimeCode(video.duration);
  videoCurrentTime.textContent = secondsToTimeCode(video.currentTime);
  videoProgressWrap.setAttribute('max', video.duration);
  videoProgressWrap.value = video.currentTime;
});
```

> `secondsToTimeCode()` 函数的作用是将秒数转换为 “hh:mm:ss” 格式的字符串

效果如下：

![显示视频元数据的媒体播放器](https://img.alicdn.com/imgextra/i4/O1CN01JdPwJZ22Ot7889PpC_!!6000000007111-2-tps-426-750.png)

### 播放/暂停

接下来我们添加一个播放/暂停按钮，该按钮可以根据当前的播放状态来决定是要执行播放还是暂停。

```diff
<div id="videoContainer">
  <video id="video" src="file.mp4"></video>
  <div id="videoControls">
+   <button id="playPauseButton"></button>
    <div id="videoCurrentTime"></div>
    <div id="videoDuration"></div>
    <progress id="videoProgressWrap" value="0" min="0">
      <span id="progressBar"></span>
    </progress>
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

我们通过监听视频的 `play` 和 `pause` 事件来改变视频控件的样式，而不是在 `click` 事件中处理。这样的好处是当浏览器或其他程序触发视频播放状态变更时，我们的视频控件依然能保持与播放状态的同步。

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

当 video 的 `currentTime` 属性变更时将触发 video 元素的 `timeupdate` 事件，我们通过监听该事件来更新这些自定义控件的状态。

```js
video.addEventListener('timeupdate', function() {
  if (videoControls.classList.contains('visible')) { // 只在可见时更新控件
    videoCurrentTime.textContent = secondsToTimeCode(video.currentTime);
    videoProgressWrap.value = video.currentTime;
    progressBar.style.width = Math.floor((video.currentTime / video.duration) * 100) + '%';
  }
});
```

当视频结束时，我们将按钮状态更新为“播放”，将视频当前时间设置回 0 并显示视频控件。

```js
video.addEventListener('ended', function() {
  playPauseButton.classList.remove('playing');
  video.currentTime = 0;
  videoControls.classList.add('visible');
});
```

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
    <progress id="videoProgressWrap" value="0">
      <span id="progressBar"></span>
    </progress>
  </div>
</div>
```

```js
const skipTime = 10; // Time to skip in seconds

seekForwardButton.addEventListener('click', function(event) {
  event.stopPropagation();
  video.currentTime = Math.min(video.currentTime + skipTime, video.duration);
});

seekBackwardButton.addEventListener('click', function(event) {
  event.stopPropagation();
  video.currentTime = Math.max(video.currentTime - skipTime, 0);
});
```

跟播放/暂停按钮一样，这里我们不在 `click` 事件中处理前进后退要应用的样式，而是监听 `seeking` 和 `seeked` 事件来调整视频的亮度。

> "seeking" 样式类的实现类似：`filter: brightness(0);`

```js
video.addEventListener('seeking', function() {
  video.classList.add('seeking');
});

video.addEventListener('seeked', function() {
  video.classList.remove('seeking');
});
```

### 进度条

最后让我们来看看进度条的实现。

首先是进度条的样式。我们使用到了 [progress](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/progress) 元素，它接受 `max` 属性指示进度条的总进度长度，`value` 属性指示进度条的当前的进度。

```html
<progress value="70" max="100"></progress>
```

![](https://img.alicdn.com/imgextra/i2/O1CN018BQEZW1FiCe2hdh61_!!6000000000520-2-tps-204-58.png)

progress 的子元素是用来做兜底显示的，当浏览器不支持 progress 元素渲染时将显示其子元素。

我在示例中添加了一个 span 元素来作为兜底的进度显示：

```html
<progress id="videoProgressWrap" value="0">
  <span id="progressBar"></span>
</progress>
```

当视频的元数据加载完成，我们就可以使用这些数据来创建进度条：

```js
videoProgressWrap.setAttribute('max', video.duration);
videoProgressWrap.value = video.currentTime;
progressBar.style.width = Math.floor((video.currentTime / video.duration) * 100) + '%';
```

当用户点击进度条时，我们可以根据用户的点击位置来设置视频的当前播放时间：

```js
videoProgressWrap.addEventListener('click', function(e) {
  const pos = (e.pageX  - this.offsetLeft) / this.offsetWidth;
  video.currentTime = pos * video.duration;
});
```

以下就是我们迄今为止创建的内容效果。

![自定义控件演示效果](https://img.alicdn.com/imgextra/i1/O1CN017ATCsY1K1DY8WNNNZ_!!6000000001103-1-tps-428-694.gif)

## 全屏体验

在这一节中，我们将尝试创建良好的全屏体验。要查看它的实际效果，可以访问[线上示例]()。

### 防止自动全屏

在 iOS 上，当视频开始播放时，video 元素会自动进入全屏模式。由于我们正在尝试尽可能多地定制和控制跨移动浏览器的媒体体验，因此建议设置 video 元素的 `playsinline` 属性以强制它在 iOS 上内联播放，并且在播放开始时不进入全屏模式。该属性的设置对其他浏览器没有副作用。

```diff
<div id="videoContainer">
-  <video id="video" src="file.mp4"></video>
+  <video id="video" src="file.mp4" playsinline></video>
  <div id="videoControls">...</div>
</div>
```

### 单击按钮切换全屏

下面让我们来实现这样的效果：当用户单击 “全屏按钮” 时，进入全屏播放模式；如果当前已经是全屏模式，则退出全屏。这需要使用 [Fullscreen API](https://fullscreen.spec.whatwg.org/)。

```diff
<div id="videoContainer">
  <video id="video" src="file.mp4"></video>
  <div id="videoControls">
    <button id="playPauseButton"></button>
    <button id="seekForwardButton"></button>
    <button id="seekBackwardButton"></button>
+   <button id="fullscreenButton"></button>
    <div id="videoCurrentTime"></div>
    <div id="videoDuration"></div>
    <progress id="videoProgressWrap" value="0">
      <span id="progressBar"></span>
    </progress>
  </div>
</div>
```

> 不同浏览器所提供的 Fullscreen API 有所差异，可以使用类似 [screenfull.js](https://github.com/sindresorhus/screenfull.js) 这样的库来处理。

```js
fullscreenButton.addEventListener('click', function(event) {
  event.stopPropagation();
  if (document.fullscreenElement) {
    document.exitFullscreen();
  } else {
    requestFullscreenVideo();
  }
});

function requestFullscreenVideo() {
  if (videoContainer.requestFullscreen) {
    videoContainer.requestFullscreen();
  } else {
    video.webkitEnterFullscreen();
  }
}

document.addEventListener('fullscreenchange', function() {
  fullscreenButton.classList.toggle('active', document.fullscreenElement);
});
```

![单击按钮进入全屏演示效果](https://img.alicdn.com/imgextra/i1/O1CN01BRZK6Q1jKKTIHvRg4_!!6000000004529-1-tps-590-1280.gif)

### 屏幕方向改变自动切换全屏

当用户正在播放视频，并且旋转设备到横向时，我们可以主动进入切换至全屏模式。这需要使用到 [Screen Orientation API](https://w3c.github.io/screen-orientation/)。

需要注意的是，该 API 在[浏览器的支持情况](https://caniuse.com/mdn-api_screen_orientation)不一，并且在某些浏览器上仍带有前缀。因此这将是我们一个渐进增强的功能。

```js
if ('orientation' in screen) {
  screen.orientation.addEventListener('change', function() {
    if (screen.orientation.type.startsWith('landscape')) {
      requestFullscreenVideo();
    } else if (document.fullscreenElement) {
      document.exitFullscreen();
    }
  });
}
```

### 锁定横向全屏

横向模式下的观看视频的体验更佳，所以我们可以在用户单击 “全屏按钮” 时以横向模式锁定屏幕。这需要使用到之前的 Screen Orientation API 和一些[媒体查询](https://developer.mozilla.org/en-US/docs/Web/CSS/Media_Queries/Using_media_queries)的能力。

我们可以通过调用 `screen.orientation.lock('landscape')` 很方便地横向锁定屏幕，但需要注意的是，我们应该在设备处于纵向模式且设备非宽屏时才这样做（排除掉平板电脑的场景）。

```diff
fullscreenButton.addEventListener('click', function(event) {
  event.stopPropagation();
  if (document.fullscreenElement) {
    document.exitFullscreen();
  } else {
    requestFullscreenVideo();
+   lockScreenInLandscape();
  }
});
```

```js
function lockScreenInLandscape() {
  if (!('orientation' in screen)) {
    return;
  }
  if (matchMedia('(orientation: portrait) and (max-device-width: 768px)').matches) {
    screen.orientation.lock('landscape');
  }
}
```

### 屏幕方向改变时退出全屏

我们刚刚创建的锁屏体验并不完美，因为当用户设备切换回纵向后我们并没有退出全屏。

为了解决这个问题，我们需要使用到 [Device Orientation API](https://w3c.github.io/deviceorientation/spec-source-orientation.html)。该 API 提供来自硬件的信息，用于测量设备在空间中的位置和运动。当我们检测到设备方向变化时，判断当前是在纵向模式下并且屏幕是横向锁定状态，则调用 `screen.orientation.unlock()` 解除锁定。

```diff
function lockScreenInLandscape() {
  if (!('orientation' in screen)) {
    return;
  }
  // Let's force landscape mode only if device is in portrait mode and can be held in one hand.
  if (matchMedia('(orientation: portrait) and (max-device-width: 768px)').matches) {
    screen.orientation.lock('landscape')
+   .then(function() {
+     listenToDeviceOrientationChanges();
+   });
  }
}
```

```js
function listenToDeviceOrientationChanges() {
  if (!('DeviceOrientationEvent' in window)) {
    return;
  }
  var previousDeviceOrientation, currentDeviceOrientation;
  window.addEventListener('deviceorientation', function onDeviceOrientationChange(event) {
    // event.beta represents a front to back motion of the device and
    // event.gamma a left to right motion.
    if (Math.abs(event.gamma) > 10 || Math.abs(event.beta) < 10) {
      previousDeviceOrientation = currentDeviceOrientation;
      currentDeviceOrientation = 'landscape';
      return;
    }
    if (Math.abs(event.gamma) < 10 || Math.abs(event.beta) > 10) {
      previousDeviceOrientation = currentDeviceOrientation;
      // When device is rotated back to portrait, let's unlock screen orientation.
      if (previousDeviceOrientation == 'landscape') {
        screen.orientation.unlock();
        window.removeEventListener('deviceorientation', onDeviceOrientationChange);
      }
    }
  });
}
```

来看看最终的全屏体验效果：

![全屏体验演示效果](https://img.alicdn.com/imgextra/i3/O1CN01HQY7A11kraqz2aUCL_!!6000000004737-1-tps-590-1280.gif)

## 后台播放

当网页或网页中的视频不可见时，我们可能需要暂停视频，或者向用户显示自定义按钮。

### 页面不可见时暂停视频

我们可以使用 [Page Visibility API](https://www.w3.org/TR/page-visibility/) 来确定页面的当前可见性并且监听其可见性状态的变化。下面的代码在页面隐藏时暂停视频。例如，当屏幕锁定或切换标签时，就会发生这种情况。

```js
document.addEventListener('visibilitychange', function() {
  if (document.hidden) {
    video.pause();
  }
});
```

### 视频可见性更改时显示或隐藏静音按钮

使用 [Intersection Observer API](https://developers.google.com/web/updates/2016/04/intersectionobserver) 可以获得更精细粒度的信息。可以通过该 API 观察到的元素何时进入或退出浏览器的视窗。

下面让我们来实现根据页面中的视频的可见性显示或隐藏静音按钮。如果视频正在播放但当前不可见，页面右下角将显示一个迷你的静音按钮，让用户控制视频声音。`volumechange` 视频事件用于更新静音按钮的样式。

```html
<button id="muteButton"></button>
```

```js
if ('IntersectionObserver' in window) {
  function onIntersection(entries) {
    entries.forEach(function(entry) {
      muteButton.hidden = video.paused || entry.isIntersecting;
    });
  }
  const observer = new IntersectionObserver(onIntersection);
  observer.observe(video);
}

muteButton.addEventListener('click', function() {
  video.muted = !video.muted;
});

video.addEventListener('volumechange', function() {
  muteButton.classList.toggle('active', video.muted);
});
```

![演示效果](https://img.alicdn.com/imgextra/i2/O1CN01EYZs2021LOTfBkGnH_!!6000000006968-1-tps-590-1280.gif)

### 一次只播放一个视频

最后，如果页面上有多个视频，则应该只播放一个视频并自动暂停其他视频，这样用户就不必听到多个音轨同时播放。

```js
// Note: This array should be initialized once all videos have been added.
const videos = Array.from(document.querySelectorAll('video'));

videos.forEach(function(video) {
  video.addEventListener('play', pauseOtherVideosPlaying);
});

function pauseOtherVideosPlaying(event) {
  const videosToPause = videos.filter(function(video) {
    return !video.paused && video != event.target;
  });
  videosToPause.forEach(function(video) {
    video.pause();
  });
}
```

## 参考资料

- [Creating a cross-browser video player](https://developer.mozilla.org/en-US/docs/Web/Guide/Audio_and_video_delivery/cross_browser_video_player)
- [Mobile Web Video Playback](https://developers.google.com/web/fundamentals/media/mobile-web-video-playback)
- [How to build a Custom HTML5 Video Player with JavaScript](https://freshman.tech/custom-html5-video/)
- [Fullscreen API](https://fullscreen.spec.whatwg.org/)
- [Screen Orientation API](https://w3c.github.io/screen-orientation/)
- [Device Orientation API](https://w3c.github.io/deviceorientation/spec-source-orientation.html)
- [Page Visibility API](https://www.w3.org/TR/page-visibility/)
- [Intersection Observer API](https://developers.google.com/web/updates/2016/04/intersectionobserver)
- [Using media queries](https://developer.mozilla.org/en-US/docs/Web/CSS/Media_Queries/Using_media_queries)