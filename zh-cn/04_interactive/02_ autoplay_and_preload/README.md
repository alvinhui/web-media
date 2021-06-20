# 自动播放和预加载资源

## 自动播放

自动播放是指无需用户主动进行操作即开始播放媒体的行为。在页面加载后立即自动开始播放音频对用户来说可能是一个不受欢迎的行为。

虽然媒体的自动播放功能很有用，但应谨慎使用，并且仅在需要时使用。为了让用户对此进行控制，浏览器通常会提供各种设置来限制自动播放行为。接下来将介绍各种媒体中的自动播放功能，包括如何启用自动播放以及如何处理自动播放被阻止的情况。

### 自动播放的可用性

从用户的角度来看，在没有提示的情况下自发地发出声音的网页可能会令人反感。因此，浏览器通常只在特定情况下允许网页执行进行自动播放行为。

通常来说，可以假设只有在以下至少一项条件满足时才允许网页中的媒体执行自动播放行为：

- 音频静音或音量设置为 0；
- 用户在网页上进行了交互（点击、按键等）；
- 该站点已被列入白名单：如果浏览器确定用户频繁使用媒体，可能会自动将该网站列入白名单，又或者用户通过浏览器手动设置；
- 自动播放功能策略授予该网页或 `<iframe>` 自动播放权限。

否则播放可能会被阻止。导致阻止的确切情况以及网站如何被列入白名单的具体细节因浏览器而异，但以上都是很好的指导方针。

> 当源媒体没有音轨或音轨静音时，不会对 `<video>` 元素应用自动播放阻止。

有关详细信息，可以参阅 [Google Chrome](https://developers.google.com/web/updates/2017/09/autoplay-policy-changes) 和 [WebKit](https://webkit.org/blog/7734/auto-play-policy-changes-for-macos/) 的自动播放策略。

### 如何启用自动播放

既然我们已经介绍了什么是自动播放以及什么时候会阻止自动播放，接下来看看我们如何在页面加载时自动播放媒体，如何检测自动播放失败，以及当浏览器拒绝自动播放时的如何应对。

#### 自动播放属性

设置自动播放的最简单方法就是将 `autoplay` 属性添加到 `<audio>` 或 `<video>` 元素。设置该属性后，媒体将在发生以下情况后尽快开始自动播放：

- 该页面可以使用自动播放功能；
- 该元素已在页面加载期间被创建；
- 假设网络性能或带宽没有显着变化，并且已接收到足够的数据。

`<audio>` 使用 `autoplay` 属性的示例如下：

```html
<audio autoplay>
  <source src="/music/chapter.mp3">
</audio>
```

##### 检测自动播放失败

如果程序依赖自动播放来处理任何重要的事情，或者如果自动播放失败会以任何方式影响到应用程序，则可能希望能够知道它何时没有开始自动播放。不幸的是，使用 `autoplay` 属性的话，识别自动播放是否成功开始是很棘手的。自动播放失败时不会触发事件，也不会抛出异常，也没有可以设置的回调。能做的就是检查一些值，并对自动播放是否有效做出有根据的猜测。

当然我们可以换一种方式，更好的做法是依赖媒体播放已成功开始来处理程序，而不是判断何时播放失败。可以通过侦听在媒体元素上触发的事件来轻松完成此操作。

来看一下这个示例：

```html
<video src="video.mp4" autoplay onplay="handleFirstPlay(event)">
```

示例中有一个 `<video>` 元素，其 `autoplay` 属性已设置，并设置了 `onplay` 的事件处理程序；该事件由一个名为  `handleFirstPlay` 的函数来进行处理，该函数接收 `play` 事件对象作为输入。

`handleFirstPlay()` 的示例代码：

```js
let hasPlayed = false;
function handleFirstPlay(event) {
  if(hasPlayed === false) {
    hasPlayed = true;
    const vid = event.target;
    vid.onplay = null;

    // 执行第一次播放开始后的逻辑处理
  }
}
```

从事件对象([Event](https://developer.mozilla.org/en-US/docs/Web/API/Event)) 获取对视频元素的引用([target](https://developer.mozilla.org/en-US/docs/Web/API/Event/target))，将元素的 `onplay` 处理程序设置为 `null`。这将防止任何未来的 `play` 事件再次触发该处理程序。

> 注意：该实现不区分自动播放和用户手动触发播放。

#### 自动播放 API

还可以通过脚本在处理用户输入之外触发自动播放，这是通过调用媒体元素的 [`play()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/play) 方法来实现的。

> 注意：强烈建议尽可能使用 `autoplay` 属性，因为 `autoplay` 与其他自动播放媒体的方式相比，该属性对自动播放的支持更为广泛，另外它还让浏览器负责开始播放，从而优化播放时机。

示例：播放网页中找到的第一个 `<video>` 元素。

```js
document.querySelector("video").play();
```

> 除非网页具备自动播放媒体的权限，否则调用 `play()` 不会让视频开始播放。

##### 检测自动播放失败

当使用 `play()` 方法来播放媒体时，检测自动播放失败要容易得多。`play()` 将返回一个 `Promise`，因此当自动播放失败时，可以为用户提供手动执行播放的操作。

示例代码：

```js
videoElem.play().catch(error => {
  if (error.name === "NotAllowedError") {
    showPlayButton(videoElem);
  } else {
    // Handle a load or playback error
  }
});
```

该示例向 `catch()` 添加一个处理程序，该处理程序会查看错误的 `name` 是否是 `NotAllowedError`，该名称表示由于权限问题导致播放失败，例如自动播放被阻止。如果是这种情况，我们应该提供一个用户界面让用户手动执行播放 ———— 示例中的 `showPlayButton()` 函数的作用。其他错误则需要酌情处理。

### 自动播放功能政策

除了浏览器端对自动播放功能的管理和控制之外，Web 服务器还可以对此进行控制。

HTTP 的 [Feature-Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Feature-Policy) 响应头 `autoplay` 字段用于指示哪些域可以使用自动播放功能。默认情况下，`autoplay` 设置为'self'，表示允许同域网页执行自动播放：

```
Feature-Policy: autoplay 'self'
```

还可以指定 'none' 来完全禁用自动播放，'*' 允许来自所有域的自动播放，或者可以通过空格字符分隔的方式允许一个或多个特定来源。

```
Feature-Policy: autoplay 'self' https://example.media
```

指定的功能策略适用于文档和其中的每个 `<iframe>` 嵌套。除非这些 iframe 指定了 allow 属性。这可以为该 iframe 和嵌套在其中的所有 iframe 设置新的功能策略：

```html
<iframe src="https://example2.com" allow="autoplay"></iframe>
```

还可以指定值 'src' 来仅允许与 iframe 的 src 属性指定的值相同的域执行自动播放（意味着子嵌套 iframe 如果不同域则不拥有自动播放权限）：

```html
<iframe src="https://example2.com" allow="autoplay 'src'"></iframe>
```

### 最佳实践

对于视频内容来说，如果非要执行自动播放，则最好的做法是将 `<video>` 元素配置为默认静音：

```html
<video src="/videos/awesomevid.webm" controls autoplay muted>
```

这个视频元素配置了 `controls` 属性以包含用户控件（通常是播放/暂停、在视频的时间轴、音量控制和静音），此外由于设置了 `muted` 和 `autoplay` 属性，视频将自动播放但静音。但是，用户仍可以通过单击控件中的取消静音按钮来重新启用音频。

## 预加载资源

当用户点击开始播放按钮后，应尽可能地减少[缓冲带来的等待](https://www.digitaltrends.com/web/buffer-rage/)，更快速流畅地播放媒体。

接下来将介绍几种通过主动预加载资源来加速媒体播放的技术。

<video controls muted playsinline>
  <source src="https://storage.googleapis.com/web-dev-assets/fast-playback-with-preload/video-preload-hero.webm#t=1.1" type="video/webm">
  <source src="https://storage.googleapis.com/web-dev-assets/fast-playback-with-preload/video-preload-hero.mp4#t=1.1" type="video/mp4">
</video>

预加载媒体资源有三种常见的方法，来看一下他们的优缺点：

|   | 优点 | 缺点 |
| -------- | -------- | -------- |
| 视频属性 | 易用，尤其是托管在 Web 服务器上只有完整的媒体文件 | 浏览器可能会忽略该属性；当 HTML 文档被完全加载和解析后才开始获取资源。|
| 链接标签 | 在不阻塞文档 `onload` 事件的情况下请求视频资源；与 MSE 和文件段配合良好。	| 与 HTTP 范围请求不兼容；获取整个媒体资源时应仅限于小型文件 (<5 MB)。|
| 手动缓冲 | 完全控制	| 复杂的错误处理。 |

### 通过视频元素属性预加载资源

如果视频资源托管在 Web 服务器上只有完整的文件，则可以使用 `video` 元素的 [`preload`](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/video#attr-preload) 属性向浏览器指示要预加载多少的内容。

只有在 HTML 文档完全加载和解析后才会开始获取资源（例如 DOMContentLoaded 事件已触发），而在实际获取资源时将触发 load 事件：

![](https://img.alicdn.com/imgextra/i4/O1CN014Y1JxL1zhiXu93u8N_!!6000000006746-55-tps-856-250.svg)

将 `preload` 属性设置为 `metadata` 表示不需要整个视频但需要获取其元数据（尺寸、时长等）。需要注意的是，该属性的默认值在不同浏览器中是不同的。

```html
<video id="video" preload="metadata" src="file.mp4" controls></video>

<script>
  video.addEventListener('loadedmetadata', function() {
    if (video.buffered.length === 0) return;

    const bufferedSeconds = video.buffered.end(0) - video.buffered.start(0);
    console.log(`${bufferedSeconds} seconds of video are ready to play.`);
  });
</script>
```

将 `preload` 属性设置为 `auto` 指示浏览器如果需要的话可以下载整个视频（即使用户并不一定会用它），从而可以在用户播放时不需要进一步缓冲来完成播放。

```html
<video id="video" preload="auto" src="file.mp4" controls></video>

<script>
  video.addEventListener('loadedmetadata', function() {
    if (video.buffered.length === 0) return;

    const bufferedSeconds = video.buffered.end(0) - video.buffered.start(0);
    console.log(`${bufferedSeconds} seconds of video are ready to play.`);
  });
</script>
```

需要注意的是，W3C 规范没有强制浏览器去遵循该属性的值来实现预加载策略，这仅仅只是个提示。以下是 Chrome 中的一些规则：

- 当 ["Save-Data"](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Save-Data) 模式启动时，Chrome 会强制 `preload` 的值为 `none`；
- 由于 Android 的 [Bug](https://bugs.chromium.org/p/chromium/issues/detail?id=612909)，在 Android 4.3 中 Chrome 强制 `preload` 的值为 `none`；
- 在蜂窝网络连接（2G、3G 和 4G）时，Chrome 会强制 `preload` 的值为 `metadata`。

如果在同一个域中包含许多视频资源，则建议将 `preload` 值设置为 `metadata` 或定义 `poster` 属性并设置`preload` 的值为 `none`：这样可以避免超过同域的最大 HTTP 连接数（HTTP 1.1 规范为 6 个）；如果视频不是网页要提供的核心内容，这也可以提高页面的渲染速度。

### 通过链接标签预加载资源

#### 预加载完整视频

...

#### 只预加载第一段内容

...

### 手动缓冲

#### 注意事项

##### 设备电量

...

##### 检测 "Save-Data"

...

##### 关注网络状况

...

#### 预缓存多个视频的第一段内容

##### 获取和缓存

...

##### 播放视频

...

#### 使用 Service Worker

...

## 参考资料

- [媒体和 Web 音频 API 的自动播放指南](https://developer.mozilla.org/en-US/docs/Web/Media/Autoplay_guide)
- [通过主动预加载资源来加速媒体播放](https://web.dev/fast-playback-with-preload/)