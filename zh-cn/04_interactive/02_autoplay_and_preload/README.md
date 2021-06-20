# 自动播放和预加载资源

上一个章节介绍了如何在网页中使用视频和音频。但作为开发者，还要思考如何给用户提供更好的媒体交互体验。这个章节将介绍最常见的两个优化手段：自动播放和预加载资源。

## 目录

- [自动播放](#自动播放)
  - [可用性](#可用性)
  - [如何启用](#如何启用)
  - [功能政策](#功能政策)
  - [最佳实践](#最佳实践)
- [预加载资源](#预加载资源)
  - [视频元素属性](#视频元素属性)
  - [资源链接标签](#资源链接标签)
  - [手动缓冲](#手动缓冲)
- [参考资料](#参考资料)

## 自动播放

自动播放是指无需用户主动进行操作即开始播放媒体的行为。在页面加载后立即自动开始播放音频对用户来说可能是一个不受欢迎的行为。所以，虽然媒体的自动播放功能很有用，但应谨慎使用，并且仅在需要时使用。

为了让用户对此进行控制，浏览器通常会提供各种设置来限制自动播放行为。接下来将介绍各种媒体中的自动播放功能，包括如何启用自动播放以及如何处理自动播放被阻止的情况。

### 可用性

从用户的角度来看，在没有提示的情况下自发地发出声音的网页可能会令人反感。因此，浏览器通常只在特定情况下允许网页执行进行自动播放行为。

通常来说，可以假设只有在以下至少一项条件满足时才允许网页中的媒体执行自动播放行为：

- 音频静音或音量设置为 0；
- 用户在网页上进行了交互（点击、按键等）；
- 该站点已被列入白名单：如果浏览器确定用户频繁使用媒体，可能会自动将该网站列入白名单，又或者用户通过浏览器手动设置；
- 自动播放功能策略授予该网页或 `<iframe>` 自动播放权限。

否则播放可能会被阻止。导致阻止的确切情况以及网站如何被列入白名单的具体细节因浏览器而异，但以上都是很好的指导方针。

> 当源媒体没有音轨或音轨静音时，不会对 `<video>` 元素应用自动播放阻止。

有关详细信息，可以参阅 [Google Chrome](https://developers.google.com/web/updates/2017/09/autoplay-policy-changes) 和 [WebKit](https://webkit.org/blog/7734/auto-play-policy-changes-for-macos/) 的自动播放策略。

### 如何启用

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
    // 酌情处理
  }
});
```

该示例向 `catch()` 添加一个处理程序，该处理程序会查看错误的 `name` 是否是 `NotAllowedError`，该名称表示由于权限问题导致播放失败，例如自动播放被阻止。如果是这种情况，我们应该提供一个用户界面让用户手动执行播放 ———— 示例中的 `showPlayButton()` 函数的作用。其他错误则需要酌情处理。

### 功能政策

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
| 资源链接标签 | 在不阻塞文档 `onload` 事件的情况下请求视频资源；与 MSE 和文件段配合良好。	| 与 HTTP 范围请求不兼容；获取整个媒体资源时应仅限于小型文件 (<5 MB)。|
| 手动缓冲 | 完全控制	| 复杂的错误处理。 |

### 视频元素属性

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

### 资源链接标签

[资源预加载链接](https://w3c.github.io/preload/)是一种获取声明，用于强制浏览器请求某资源而不阻塞页面下载 和 load 事件。通过 `<link rel="preload">` 加载的资源被缓存到本地浏览器，在 DOM、JavaScript 或 CSS 中明确引用它们之前不会被载入。

![](https://img.alicdn.com/imgextra/i4/O1CN01RgHVrz1I8swr3RT95_!!6000000000849-55-tps-856-250.svg)

#### 预加载整个视频

下面是在网页上预加载整个视频的方法，当 JavaScript 要求获取视频资源时，它会从缓存中读取，因为浏览器可能已经缓存了该资源。如果预加载请求尚未完成，则会发起常规的网络请求。

```html
<link rel="preload" as="video" href="https://cdn.com/small-file.mp4">

<video id="video" controls></video>

<script>
  // 在满足某些条件后，将视频源设置为预加载的视频 URL
  video.src = 'https://cdn.com/small-file.mp4';
  video.play().then(() => {
    // 如果已缓存预加载的视频URL，将立即开始播放
  });
</script>
```

注意：建议仅将其用于小型媒体文件（小于 5MB）；

示例中由视频元素消费预加载的资源，因此 `as` 预加载链接值为 `video`。如果消费它的是一个音频元素，那么将使用`as="audio"`。

#### 只预加载第一段内容

下面的示例显示了如何使用 `<link rel="preload">` 预加载视频的第一段并将其与[媒体源扩展 API](https://developer.mozilla.org/en-US/docs/Web/API/Media_Source_Extensions_API) 结合一起使用。

为了方便起见，我们假设整个视频已经被分成像更小的文件：file_1.webm，file_2.webm，file_3.webm 等。

```html
<link rel="preload" as="fetch" href="https://cdn.com/file_1.webm">

<video id="video" controls></video>

<script>
  const video = document.getElementByID('video');
  const mediaSource = new MediaSource();
  video.srcObject = mediaSource;

  // 创建实例都是同步的，但是底层流和 videoc 的连接时异步的
  // MS 提供了一个 sourceopen 事件给我们进行这项异步处理
  // 一旦连接到一起之后该事件就会触发
  mediaSource.addEventListener('sourceopen', sourceOpen, { once: true });

  function sourceOpen() {
    const sourceBuffer = mediaSource.addSourceBuffer('video/webm; codecs="vp09.00.10.08"');

    // 如果已经预加载了视频，fetch 将立即从浏览器缓存返回响应
    fetch('https://cdn.com/file_1.webm')
    .then(response => response.arrayBuffer())
    .then(data => {
      // 将数据附加到新的 sourceBuffer 中
      sourceBuffer.appendBuffer(data);
      // TODO: 当用户开始视频播放后请求 file_2.webm
    })
    .catch(error => {
      // TODO: 为用户显示错误信息
    });
  }
</script>
```

可以查看 MDN 的[浏览器兼容性表](https://developer.mozilla.org/en-US/docs/Web/HTML/Link_types/preload#browser_compatibility)，了解哪些浏览器支持资源链接标签预加载。可以使用以下代码段检测其可用性：

```js
function preloadFullVideoSupported() {
  const link = document.createElement('link');
  link.as = 'video';
  return (link.as === 'video');
}

function preloadFirstSegmentSupported() {
  const link = document.createElement('link');
  link.as = 'fetch';
  return (link.as === 'fetch');
}
```

### 手动缓冲

让我们看看如何使用 MSE 手动缓冲视频，下面的示例假设 Web 服务器支持 HTTP [Range](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Range) 请求。

```html
<video id="video" controls></video>

<script>
  const mediaSource = new MediaSource();
  video.src = URL.createObjectURL(mediaSource);
  mediaSource.addEventListener('sourceopen', sourceOpen, { once: true });

  function sourceOpen() {
    URL.revokeObjectURL(video.src);
    const sourceBuffer = mediaSource.addSourceBuffer('video/webm; codecs="vp09.00.10.08"');

    // 设置 HTTP Range
    fetch('file.webm', { headers: { range: 'bytes=0-567139' } })
    .then(response => response.arrayBuffer())
    .then(data => {
      sourceBuffer.appendBuffer(data);
      sourceBuffer.addEventListener('updateend', updateEnd, { once: true });
    });
  }

  function updateEnd() {
    // 视频现在可以播放了
    const bufferedSeconds = video.buffered.end(0) - video.buffered.start(0);
    console.log(`${bufferedSeconds} seconds of video are ready to play.`);

    // 当用户开始播放后，获取下一段视频
    video.addEventListener('playing', fetchNextSegment, { once: true });
  }

  function fetchNextSegment() {
    fetch('file.webm', { headers: { range: 'bytes=567140-1196488' } })
    .then(response => response.arrayBuffer())
    .then(data => {
      const sourceBuffer = mediaSource.sourceBuffers[0];
      sourceBuffer.appendBuffer(data);
      // TODO: 进一步获取其他片段
    });
  }
</script>
```

#### 注意事项

由于现在由网页自身来控制整个媒体缓冲，因此在预加载时需要考虑设备的电池电量、"Save-Data" 模式设置和网络情况来优化用户体验。

##### 设备电池电量

在考虑预加载视频之前，请先考虑用户设备的电池电量。这将在电量低时延长电池寿命。
当设备电池​​耗尽时，禁用预加载或至少预加载较低分辨率的视频。

```js
if ('getBattery' in navigator) {
  navigator.getBattery()
  .then(battery => {
    // 如果电池正在充电或电池电量足够高
    if (battery.charging || battery.level > 0.15) {
      // TODO: 预加载视频的第一段
    }
  });
}
```

##### "Save-Data" 模式

["Save-Data" 模式](https://developers.google.com/web/fundamentals/performance/optimizing-content-efficiency/save-data)的设计旨在为用户提供更轻量、更快的应用程序。它允许用户通过浏览器开启该配置以向网站表明客户端由于传输成本高、连接速度慢或其他原因而倾向于减少数据使用量。这并不是一个 W3C 标准，但受到了 Chrome 和 Opera 浏览器的支持。

当用户在浏览器中启用 "Save-Data" 模式时，浏览器会将 "Save-Data" 请求标添加到所有发出的请求中（HTTP 和 HTTPS）：

![](https://img.alicdn.com/imgextra/i3/O1CN01APt5jb1S6jF1980gt_!!6000000002198-2-tps-800-623.png)

因此要确定何时向用户提供“轻量级”的体验，Web 服务器可以通过检查客户端请求头中是否有 "Save-Data" 自动。在网页中则可以通过下面的示例代码进行判断：

```js
if ("connection" in navigator) {
  if (navigator.connection.saveData === true) {
    // 在此处执行数据保存操作
  }
}
```

##### 网络情况

在预加载之前可能需要对 `navigator.connection.type` 进行检查。当它的值为 `cellular` 时应该避免执行预加载。

```js
if ('connection' in navigator) {
  if (navigator.connection.type == 'cellular') {
    // TODO: 预加载视频前提示用户
  } else {
    // TODO: 预加载视频的第一段
  }
}
```

这里还有[一些示例](https://googlechrome.github.io/samples/network-information/)演示如何应对网络环境变化的情况。

#### 预缓存多个视频的第一段内容

如果网页上有多个视频内容，如何预缓存这些视频的第一段内容？可以使用功能强大且易于使用的 [Cache API](https://developer.mozilla.org/en-US/docs/Web/API/CacheStorage)。下面是介绍一些实现示例。

##### 获取和缓存

```js
const videoFileUrls = [
  'bat_video_file_1.webm',
  'cow_video_file_1.webm',
  'dog_video_file_1.webm',
  'fox_video_file_1.webm',
];

// 创建一个视频预缓存，并在其中存储所有视频的第一段内容
window.caches.open('video-pre-cache')
.then(cache => Promise.all(videoFileUrls.map(videoFileUrl => fetchAndCache(videoFileUrl, cache))));

function fetchAndCache(videoFileUrl, cache) {
  // 检测视频是否已存在缓存中
  return cache.match(videoFileUrl)
  .then(cacheResponse => {
    if (cacheResponse) {
      return cacheResponse;
    }
    // 无缓存则发起网络请求
    return fetch(videoFileUrl)
    .then(networkResponse => {
      // 将返回值添加到缓存并返回
      cache.put(videoFileUrl, networkResponse.clone());
      return networkResponse;
    });
  });
}
```

如果使用的是 HTTP Range 请求，则需要对上面的代码进行一些修改：

```js
    ...
    return fetch(videoFileUrl, { headers: { range: 'bytes=0-567139' } })
    // 立即将响应的全部内容提取到内存中
    .then(networkResponse => networkResponse.arrayBuffer())
    .then(data => {
      const response = new Response(data);
      cache.put(videoFileUrl, response.clone());
      return response;
    });
```

##### 播放视频

当用户单击播放按钮时，尝试获取缓存中可用的视频资源，有的话则立即开始播放，没有则发起网络请求来获取资源。

```js
function onPlayButtonClick(videoFileUrl) {
  video.load(); // 重置为初始状态

  window.caches.open('video-pre-cache')
  .then(cache => fetchAndCache(videoFileUrl, cache))
  .then(response => response.arrayBuffer())
  .then(data => {
    const mediaSource = new MediaSource();
    video.srcObject = mediaSource;
    mediaSource.addEventListener('sourceopen', sourceOpen, { once: true });

    function sourceOpen() {
      const sourceBuffer = mediaSource.addSourceBuffer('video/webm; codecs="vp09.00.10.08"');
      sourceBuffer.appendBuffer(data);
      video.play().then(() => {
        // TODO: 开始播放后获取视频的剩余部分
      });
    }
  });
}
```

## 参考资料

- [Autoplay guide for media and Web Audio APIs](https://developer.mozilla.org/en-US/docs/Web/Media/Autoplay_guide)
- [Fast playback with audio and video preload](https://web.dev/fast-playback-with-preload/)
- [Link types: preload](https://developer.mozilla.org/en-US/docs/Web/HTML/Link_types/preload)