# 定制播放行为

在网页中我们可以通过 `<video>` 标签便捷地引入视频内容。但依然存在一些问题，例如：

- 不同的系统平台（iOS、安卓）或不同的浏览器的媒体体验是不同的 —— 界面及交互的差异；
- 无法为播放器添加更多的控件 —— 是否开启弹窗、是否需要字幕等。

这就是为什么开发者可能需要定制播放器的原因之一，如果你想在网页上创造更好的媒体体验的话。

本文将展示如何通过大量的 Web API 以渐进的方式增强媒体体验，构建一个包括自定义控件、全屏体验和后台播放能力的简单一致的移动播放器。

## 自定义控件

### 获取视频元数据

### 播放/暂停

### 音量控制/静音

### 快进和后退

### 进度条

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