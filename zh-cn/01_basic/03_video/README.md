# 理解视频

## 目录

- [基础概念](#基础概念)
- [消除冗余（压缩）](#消除冗余（压缩）)
  - [颜色和亮度](#颜色和亮度)
  - [帧类型](#帧类型)
  - [时间冗余（帧间预测）](#时间冗余（帧间预测）)
  - [空间冗余（帧内预测）](#空间冗余（帧内预测）)
  - [副作用](#副作用)
  - [优化手段](#优化手段)
- [编解码器](#编解码器)
  - [是什么？为什么？怎么做？](#是什么？为什么？怎么做？)
  - [影响编码质量的因素](#影响编码质量的因素)
  - [常用的编码格式](#常用的编码格式)
  - [选择合适的编码格式](#选择合适的编码格式)
- [视频容器](#视频容器)
  - [什么是容器格式](#什么是容器格式)
  - [常用的容器格式](#常用的容器格式)
  - [选择合适的容器格式](#选择合适的容器格式)
- [参考资料](#参考资料)

## 基础概念

我们可以将**视频**定义为在**单位时间**内**连续的 n 个图像**，一个图像我们称之为**一帧**。

这可以视作一个新的维度，n 即为**帧率**，若单位时间为秒，则等同于 FPS (每秒帧数 Frames Per Second)。

![video](./assets/video.png)

播放一段视频每秒所需的数据量就是它的**比特率**（即常说的码率）。

> 比特率 = 宽 * 高 * 颜色深度 * 帧每秒

例如，一段每秒 30 帧，每像素 24 bits，分辨率是 480x240 的视频，如果我们不做任何压缩，它将需要 **82,944,000 比特每秒**或 82.944 Mbps (30x480x240x24)。

当**比特率**几乎恒定时称为恒定比特率（**CBR**）；但它也可以变化，称为可变比特率（**VBR**）。

> 这个图形显示了一个受限的 VBR，当帧为黑色时不会花费太多的数据量。
>
> ![constrained vbr](./assets/vbr.png)

## 消除冗余（压缩）

我们认识到，不对视频进行压缩是不行的；**一个单独的一小时长的视频**，分辨率为 720p 和 30fps 时将**需要 278GB<sup>\*</sup>**。仅仅使用无损数据压缩算法——如 DEFLATE（被PKZIP, Gzip, 和 PNG 使用）——也无法充分减少视频所需的带宽，我们需要找到其它压缩视频的方法。

> <sup>*</sup>我们使用乘积得出这个数字 1280 x 720 x 24 x 30 x 3600 （宽，高，每像素比特数，fps 和秒数）

为此，我们可以**利用视觉特性**：和区分颜色相比，我们区分亮度要更加敏锐。**时间上的重复**：一段视频包含很多只有一点小小改变的图像。**图像内的重复**：每一帧也包含很多颜色相同或相似的区域。

### 颜色和亮度

我们的眼睛[对亮度比对颜色更敏感](http://vanseodesign.com/web-design/color-luminance/)，你可以看看下面的图片自己测试。

![luminance vs color](./assets/luminance_vs_color.png)

如果你看不出左图的**方块 A 和方块 B** 的颜色是**相同的**，那么好，是我们的大脑玩了一个小把戏，这让我们更多的去注意光与暗，而不是颜色。右边这里有一个使用同样颜色的连接器，那么我们（的大脑）就能轻易分辨出事实，它们是同样的颜色。

一旦我们知道我们对**亮度**（图像中的亮度）更敏感，我们就可以利用它。

#### 色度子采样

一旦我们能从图像中分离出亮度和色度，我们就可以利用人类视觉系统对亮度比色度更敏感的特点，选择性地剔除信息。**色度子采样**是一种编码图像时，使**色度分辨率低于亮度**的技术。

![ycbcr 子采样分辨率](./assets/ycbcr_subsampling_resolution.png)

我们应该减少多少色度分辨率呢？已经有一些模式定义了如何处理分辨率和合并（`最终的颜色 = Y + Cb + Cr`）。

这些模式称为子采样系统，并被表示为 3 部分的比率 - `a:x:y`，其定义了色度平面的分辨率，与亮度平面上的、分辨率为 `a x 2` 的小块之间的关系。
* `a` 是水平采样参考 (通常是 4)，
* `x` 是第一行的色度样本数（相对于 a 的水平分辨率），
* `y` 是第二行的色度样本数。

现代编解码器中使用的常用方案是： 4:4:4 (没有子采样), 4:2:2, 4:1:1, 4:2:0, 4:1:0。

<table style="max-width: 46em;">
  <thead>
    <tr>
      <th style="width: 144px;"></th>
      <th style="width: 144px;">4:2:0</th>
      <th style="width: 144px;">4:2:2</th>
      <th style="width: 144px;">4:4:4</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th style="width: 144px;">亮度</th>
      <td style="width: 144px; text-align: right;">
        <img alt="Luminance of pixels in a 4:2 (8-pixel) block" src="https://mdn.mozillademos.org/files/16711/yuv-luma.svg" loading="lazy">
      </td>
      <td style="width: 144px; text-align: right;">
        <img alt="Luminance of pixels in a 4:2 (8-pixel) block" src="https://mdn.mozillademos.org/files/16711/yuv-luma.svg" loading="lazy">
      </td>
      <td style="width: 144px; text-align: right;">
        <img alt="Luminance of pixels in a 4:2 (8-pixel) block" src="https://mdn.mozillademos.org/files/16711/yuv-luma.svg" loading="lazy">
      </td>
    </tr>
    <tr>
      <th style="width: 144px;">色度（ U 和 V ）</th>
      <td style="width: 144px; text-align: right;">
        <img src="https://mdn.mozillademos.org/files/16710/yuv-chroma-420.svg" loading="lazy">
      </td>
      <td style="width: 144px; text-align: right;">
        <img src="https://mdn.mozillademos.org/files/16714/yuv-chroma-422.svg" loading="lazy">
      </td>
      <td style="width: 144px; text-align: right;">
        <img src="https://mdn.mozillademos.org/files/16716/yuv-chroma-444.svg" loading="lazy">
      </td>
    </tr>
    <tr>
      <th style="width: 144px;">像素解码</th>
      <td style="width: 144px; text-align: right;">
        <img src="https://mdn.mozillademos.org/files/16713/yuv-decoded-420.png" loading="lazy">
      </td>
      <td style="width: 144px; text-align: right;">
        <img src="https://mdn.mozillademos.org/files/16715/yuv-decoded-422.png" loading="lazy">
      </td>
      <td style="width: 144px; text-align: right;">
        <img src="https://mdn.mozillademos.org/files/16717/yuv-decoded-444.png" loading="lazy">
      </td>
    </tr>
  </tbody>
</table>

下图是同一张图片使用几种主要的色度子采样技术进行编码，第一行图像是最终的 YCbCr，而最后一行图像展示了色度的分辨率。这么小的损失确实是一个伟大的胜利。

![色度子采样例子](./assets/chroma_subsampling_examples.jpg "色度子采样例子")

前面我们计算过我们需要 278GB 去存储一个一小时长，分辨率在 720p 和 30fps 的视频文件。如果我们使用 `YCbCr 4:2:0` 我们能剪掉`一半的大小（139GB）`<sup>*</sup>，但仍然不够理想。

> <sup>*</sup> 我们通过将宽、高、颜色深度和 fps 相乘得出这个值。前面我们需要 24 bit，现在我们只需要 12 bit。

### 帧类型

现在我们进一步消除`时间冗余`，但在这之前让我们来确定一些基本术语。假设我们一段 30fps 的影片，这是最开始的 4 帧。

![球 1](./assets/smw_background_ball_1.png) ![球 2](./assets/smw_background_ball_2.png) ![球 3](./assets/smw_background_ball_3.png) ![球 4](./assets/smw_background_ball_4.png)

我们可以在帧内看到**很多重复内容**，如**蓝色背景**，从 0 帧到第 3 帧它都没有变化。为了解决这个问题，我们可以将它们抽象地分类为三种类型的帧。

#### I 帧（帧内编码，关键帧）

I 帧（可参考，关键帧，帧内编码）是一个**自足的帧**。它不依靠任何东西来渲染，I 帧与静态图片相似。第一帧通常是 I 帧，但我们将看到 I 帧被定期插入其它类型的帧之间。

![球 1](./assets/smw_background_ball_1.png)

#### P 帧（预测）

P 帧利用了一个事实：当前的画面几乎总能**使用之前的一帧进行渲染**。例如，在第二帧，唯一的改变是球向前移动了。仅仅使用（第二帧）对前一帧的引用和差值，我们就能重建前一帧。

![球 1](./assets/smw_background_ball_1.png) <-  ![球 2](./assets/smw_background_ball_2_diff.png)

#### B 帧（双向预测）

如何引用前面和后面的帧去做更好的压缩？！简单地说 B 帧就是这么做的。

 ![球 1](./assets/smw_background_ball_1.png) <-  ![球 2](./assets/smw_background_ball_2_diff.png) -> ![球 3](./assets/smw_background_ball_3.png)

#### 小结

这些帧类型用于提供更好的压缩率，我们将在下一章看到这是如何发生的。现在，我们可以想到 I 帧是昂贵的，P 帧是便宜的，最便宜的是 B 帧。

![帧类型例子](./assets/frame_types.png)

### 时间冗余（帧间预测）

让我们探究去除**时间上的重复**，去除这一类冗余的技术就是**帧间预测**。

我们将尝试花费较少的数据量去编码在时间上连续的 0 号帧和 1 号帧。

![原始帧](./assets/original_frames.png)

我们可以做个减法，我们简单地用 0 号帧减去 1 号帧，得到残差，这样我们就只需要**对残差进行编码**。

![残差帧](./assets/difference_frames.png)

但我们有一个更好的方法来节省数据量。首先，我们将`0 号帧` 视为一个个分块的集合，然后我们将尝试将 `帧 1` 和 `帧 0` 上的块相匹配。我们可以将这看作是**运动预测**。

> “运动补偿是一种描述相邻帧（相邻在这里表示在编码关系上相邻，在播放顺序上两帧未必相邻）差别的方法，具体来说是描述前面一帧（相邻在这里表示在编码关系上的前面，在播放顺序上未必在当前帧前面）的每个小块怎样移动到当前帧中的某个位置去。”

![原始帧运动预测](./assets/original_frames_motion_estimation.png)

我们预计那个球会从 `x=0, y=25` 移动到 `x=6, y=26`，**x** 和 **y** 的值就是**运动向量**。进一步节省数据量的方法是，只编码这两者运动向量的差。所以，最终运动向量就是 `x=6 (6-0), y=1 (26-25)`。

> 实际情况下，这个球会被切成 n 个分区，但处理过程是相同的。

帧上的物体**以三维方式移动**，当球移动到背景时会变小。当我们尝试寻找匹配的块，找不到完美匹配的块是正常的。这是一张运动预测与实际值相叠加的图片。

![运动预测](./assets/motion_estimation.png)

但我们能看到当我们使用运动预测时，**编码的数据量少于**使用简单的残差帧技术。

![运动预测 vs 残差 ](./assets/comparison_delta_vs_motion_estimation.png)

### 空间冗余（帧内预测）

如果我们分析一个视频里的每一帧，我们会看到有**许多区域是相互关联的**。

![空间内重复](./assets/repetitions_in_space.png)

让我们举一个例子。这个场景大部分由蓝色和白色组成。

![smw 背景](./assets/smw_bg.png)

这是一个 `I 帧`，我们**不能使用前面的帧来预测**，但我们仍然可以压缩它。我们将编码我们选择的那块红色区域。如果我们看看它的周围，我们可以**估计它周围颜色的变化**。

![smw 背景块](./assets/smw_bg_block.png)

我们预测:帧中的颜色在垂直方向上保持一致，这意味着**未知像素的颜色与临近的像素相同**。

![smw 背景预测](./assets/smw_bg_prediction.png)

我们的预测会出错，所以我们需要先利用这项技术（**帧内预测**），然后**减去实际值**，算出残差，得出的矩阵比原始数据更容易压缩。

![smw 残差](./assets/smw_residual.png)

### 副作用

伪影（Artifacts）是有损压缩后的副作用，产生的原因是因为压缩的过程中会丢失或重新排列数据。

为了降低副作用的影响，并让查找问题更容器，可以在一段周期内将关键帧放入，用于修复当前看到任何损坏或伪像残留。

#### 混叠（Aliasing）

混叠是对从压缩数据重建后看起来与压缩前不同的东西的统称。混叠有多种形式。您可能会看到的最常见的包括：

<table>
 <tbody>
  <tr>
   <td>
    <h4>莫尔纹</h4>
    <p>莫尔纹是当源图像中的图案和编码器的操作方式在空间上略有偏离时产生的大规模空间干涉图案。然后，由编码器生成的伪像在解码时会在源图像的图案中引入奇怪的漩涡效果。</p>
   </td>
   <td><img src="https://mdn.mozillademos.org/files/16680/moire-pattern.jpg" loading="lazy"></td>
  </tr>
  <tr>
   <td>
    <h4>阶梯效应</h4>
    <p>阶梯效应是当应该平滑的对角直线或弯曲边缘呈现锯齿状外观时出现的空间伪影，看上去有点像一组阶梯。通过“抗锯齿”过滤器可以减少这种情况。</p>
   </td>
   <td><img src="https://mdn.mozillademos.org/files/16681/staircase-effect.jpg" loading="lazy"></td>
  </tr>
  <tr>
   <td>
    <h4>轮毂效应</h4>
    <p>车轮效应（频闪效应）是电影中常见的视觉效果，由于帧率和压缩算法之间的相互作用，转向轮似乎以错误的速度甚至方向旋转。同样的效果也可能发生在任何移动的重复模式上，例如铁路线上的系材、路边的柱子等等，这是一个时间性的混叠问题，旋转速度会干扰压缩期间执行的采样频率。</p>
   </td>
   <td><img src="https://mdn.mozillademos.org/files/16682/stroboscopic-effect.gif" loading="lazy"></td>
  </tr>
 </tbody>
</table>

#### 色彩边缘（Color edging）

色彩边缘是一种视觉伪影，表现为沿着场景内有色对象的边缘引入了伪色。这些颜色与帧的内容没有颜色关系。

#### 清晰度下降

在对视频进行压缩的过程中删除数据的做法会让图像丢失一些细节。如果压缩得足够多，部分或全部图像清晰度可能会下降，表现就是图像会有点模糊或朦胧。

清晰度下降会导致图像中的文本难以阅读，因为文本（尤其是小文本）是非常注重细节的，微小的改动会明显影响其可读性。

#### Ringing

有损压缩算法可能会引入 Ringing，这种效应会导致对象外部的区域被压缩算法生成的彩色像素污染。
当算法使用的「块」跨越对象与背景之间的清晰边界时，就会发生这种情况。这在较高压缩级别时尤其常见。

![](https://mdn.mozillademos.org/files/16684/Ringing-effects.png)

注意上方恒星边缘的蓝色和粉红色条纹。这些边缘就是 Ringing 效果。

#### 海报化（Posterizing）

当压缩导致渐变中的颜色细节丢失时，会发生海报化。表现为平滑区域中各种颜色的过渡变成块状。

![](https://mdn.mozillademos.org/files/16686/posterize-effect.jpg)

注意上图的秃鹰的羽毛中的颜色是块状的（背景是雪白的猫头鹰）。羽毛的细节在很大程度上由于海报化而丢失。

#### 等高线

等高线或色带是海报化的一种特定形式，其中色块在图像中形成带或条纹。当视频以太粗糙的量化配置压缩时，会发生这种情况。结果，视频的内容呈现出“分层”的外观，从颜色到颜色的过渡不是平滑的渐变和过渡，而是突然过渡，导致出现条状色带。

![](https://mdn.mozillademos.org/files/16685/contouring-effect.jpg)

在上面的示例图像中，天空是不同深浅的蓝色条纹，而不是从深蓝到浅蓝的的渐变。

#### 运动补偿块边界伪像

就像上一个章节中讲到的，视频压缩通常通过比较两个帧并记录它们之间的差异来进行，一个帧接一个帧，直到视频结束。当摄像机固定或帧中的物体相对静止时，这种压缩技术效果很好。但是如果帧中有很多运动，则帧之间的差异数量会很大，以至于压缩效果不好。

运动补偿可能会产生伪影。这些伪影沿块边界出现，产生振铃（ringing）和色彩边缘（edging）的效果。

### 优化手段

#### 降低分辨率

在某些情况下，通过降低视频的分辨率来改善文件体积可能会很有效。虽然可能会影响播放播放的流畅度，但谨慎地进行裁剪可以有较好的投入产出比。

如果将 1080p 视频在压缩之前降低到 720p，则生成的视频体积可能会更小，同时具有更高的视觉质量。即便是在播放过程中放大，结果也可能比对原视频全尺寸压缩并接受满足该尺寸要求的匹配的质量效果更好。

#### 降低帧率

这有两个好处：使整个视频更小，让运动补偿更好地进行工作。例如，代替计算由于帧间运动而相距两个像素的两个帧的运动差异，跳过每隔一个帧可能会导致计算出四个运动像素的差异。 这使得摄像机的整体运动可以用更少的残留帧来表示。

人眼感知为运动需要的最小帧速率约为每秒 12 帧。小于此值，视频在人看来就会是一系列静止的图像。电影胶片通常为每秒 24 帧，而标清电视约为每秒 30 帧，而高清电视则介于每秒 24 至 60 帧之间。 从 24 FPS 到更高的任何值都可以让人感到运动非常平滑；30 或 60 FPS 是一个理想的数字，具体取决于需求。

可以降低多少帧率完全取决于你想到达到怎样的显示效果。

## 编解码器

### 是什么？为什么？怎么做？

- **是什么？** 就是用于压缩或解压数字视频的软件或硬件。
- **为什么？** 人们需要在有限带宽或存储空间下提高视频的质量。还记得当我们计算每秒 30 帧，每像素 24 bit，分辨率是 480x240 的视频需要多少带宽吗？没有压缩时是 **82.944 Mbps**。电视或互联网提供 HD/FullHD/4K 只能靠视频编解码器。
- **怎么做？** 接下来将介绍**通用视频编解码器背后的主要机制**，大多数概念都很实用，并被现代编解码器如 VP9, AV1 和 HEVC 使用。注意：我们将简化许多内容，我们还会使用真实的例子（主要是 H.264）来演示这些技术。

#### 第一步 - 图片分区

第一步是将**帧**分成几个**分区**，**子分区**甚至更多。

![图片分区](./assets/picture_partitioning.png)

但是为什么呢？有许多原因，比如，当我们分割图片时，我们可以更精确的处理预测，在微小移动的部分使用较小的分区，而在静态背景上使用较大的分区。

通常，编解码器将这些分区组织成切片（或瓦片），宏（或编码树单元）和许多子分区。这些分区的最大大小有所不同，HEVC 设置成 64x64，而 AVC 使用 16x16，但子分区可以达到 4x4 的大小。

还记得我们学过的**帧的分类**吗？你也可以**把这些概念应用到块**，因此我们可以有 I 切片，B 切片，I 宏块等等。

#### 第二步 - 预测

一旦我们有了分区，我们就可以在它们之上做出预测。对于帧间预测，我们需要**发送运动向量和残差**；至于帧内预测，我们需要**发送预测方向和残差**。

#### 第三步 - 转换

在我们得到残差块（`预测分区-真实分区`）之后，我们可以用一种方式**变换**它，这样我们就知道**哪些像素我们应该丢弃**，还依然能保持整体质量。这个确切的行为有几种变换方式。

尽管有[其它的变换方式](https://en.wikipedia.org/wiki/List_of_Fourier-related_transforms#Discrete_transforms)，但我们重点关注离散余弦变换（[DCT](https://en.wikipedia.org/wiki/Discrete_cosine_transform)）。它的主要功能有：

*	将**像素**块**转换**为相同大小的**频率系数块**。
*	**压缩**能量，更容易消除空间冗余。
*	**可逆的**，也意味着你可以还原回像素。

> 2017 年 2 月 2 号，F. M. Bayer 和 R. J. Cintra 发表了他们的论文：[图像压缩的 DCT 类变换只需要 14 个加法](https://arxiv.org/abs/1702.00817)。

如果你不理解每个要点的好处，不用担心，我们会尝试进行一些实验，以便从中看到真正的价值。

我们来看下面的**像素块**（8x8）：

![像素值矩形](./assets/pixel_matrice.png)

下面是其渲染的块图像（8x8）：

![像素值矩形](./assets/gray_image.png)

当我们对这个像素块**应用 DCT** 时， 得到如下**系数块**（8x8）：

![系数值 values](./assets/dct_coefficient_values.png)

接着如果我们渲染这个系数块，就会得到这张图片：

![dct 系数图片](./assets/dct_coefficient_image.png)

如你所见它看起来完全不像原图像，我们可能会注意到**第一个系数**与其它系数非常不同。第一个系数被称为直流分量，代表了输入数组中的**所有样本**，有点**类似于平均值**。

这个系数块有一个有趣的属性：高频部分和低频部分是分离的。

![dct 频率系数属性](./assets/dctfrequ.jpg)

在一张图像中，**大多数能量**会集中在[低频部分](https://www.iem.thm.de/telekom-labor/zinke/mk/mpeg2beg/whatisit.htm)，所以如果我们将图像转换成频率系数，并**丢掉高频系数**，我们就能**减少描述图像所需的数据量**，而不会牺牲太多的图像质量。

让我们通过实验学习这点，我们将使用 DCT 把原始图像转换为频率（系数块），然后丢掉最不重要的系数。

首先，我们将它转换为其**频域**。

![系数值](./assets/dct_coefficient_values.png)

然后我们丢弃部分（67%）系数，主要是它的右下角部分。

![系数清零](./assets/dct_coefficient_zeroed.png)

然后我们从丢弃的系数块重构图像（记住，这需要可逆），并与原始图像相比较。

![原始 vs 量化](./assets/original_vs_quantized.png)

如我们所见它酷似原始图像，但它引入了许多与原来的不同，我们**丢弃了67.1875%**，但我们仍然得到至少类似于原来的东西。我们可以更加智能的丢弃系数去得到更好的图像质量。

#### 第四步 - 量化

当我们丢弃一些系数时，在最后一步（变换），我们做了一些形式的量化。这一步，我们选择性地剔除信息（**有损部分**）或者简单来说，我们将**量化系数以实现压缩**。

我们如何量化一个系数块？一个简单的方法是均匀量化，我们取一个块并**将其除以单个的值**（10），并舍入值。

![量化](./assets/quantize.png)

我们如何**逆转**（重新量化）这个系数块？我们可以通过**乘以我们先前除以的相同的值**（10）来做到。

![逆转量化](./assets/re-quantize.png )

这不是最好的方法，因为它没有考虑到每个系数的重要性，我们可以使用一个**量化矩阵**来代替单个值，这个矩阵可以利用 DCT 的属性，多量化右下部，而少（量化）左上部，[JPEG 使用了类似的方法](https://www.hdm-stuttgart.de/~maucher/Python/MMCodecs/html/jpegUpToQuant.html)。

#### 第五步 - 熵编码

在我们量化数据（图像块／切片／帧）之后，我们仍然可以以无损的方式来压缩它。有许多方法（算法）可用来压缩数据。我们将简单体验其中几个。

##### VLC 编码：

让我们假设我们有一个符号流：**a**, **e**, **r** 和 **t**，它们的概率（从0到1）由下表所示。

|     | a   | e   | r    | t   |
|-----|-----|-----|------|-----|
| 概率 | 0.3 | 0.3 | 0.2 |  0.2 |

我们可以分配不同的二进制码，最好是小的码给最可能出现的字符，大些的码给最少可能出现的字符。

|        | a   | e   | r    | t   |
|--------|-----|-----|------|-----|
|   概率  | 0.3 | 0.3 | 0.2 | 0.2 |
| 二进制码 | 0 | 10 | 110 | 1110 |

让我们压缩 **eat** 流，假设我们为每个字符花费 8 bit，在没有做任何压缩时我们将花费 **24 bit**。但是在这种情况下，我们使用各自的代码来替换每个字符，我们就能节省空间。

第一步是编码字符 **e** 为 `10`，第二个字符是 **a**，追加（不是数学加法）后是 `[10][0]`，最后是第三个字符 **t**，最终组成已压缩的比特流 `[10][0][1110]` 或 `1001110`，这只需 **7 bit**（比原来的空间少 3.4 倍）。

请注意每个代码必须是唯一的前缀码，[Huffman 能帮你找到这些数字](https://en.wikipedia.org/wiki/Huffman_coding)。虽然它有一些问题，但是[视频编解码器仍然提供该方法](https://en.wikipedia.org/wiki/Context-adaptive_variable-length_coding)，它也是很多应用程序的压缩算法。

编码器和解码器都必须知道这个（包含编码的）字符表，因此你也需要传送这个表。

##### 算术编码

让我们假设我们有一个符号流：**a**, **e**, **r**, **s** 和 **t**，它们的概率由下表所示。

|     | a   | e   | r    | s    | t   |
|-----|-----|-----|------|------|-----|
| 概率 | 0.3 | 0.3 | 0.15 | 0.05 | 0.2 |

考虑到这个表，我们可以构建一个区间，区间包含了所有可能的字符，字符按出现概率排序。

![初始算法区间](./assets/range.png)

让我们编码 **eat** 流，我们选择第一个字符 **e** 位于 **0.3 到 0.6** （但不包括 0.6）的子区间，我们选择这个子区间，按照之前同等的比例再次分割。

![第二个子区间](./assets/second_subrange.png)

让我们继续编码我们的流 **eat**，现在使第二个 **a** 字符位于 **0.3 到 0.39** 的区间里，接着再次用同样的方法编码最后的字符 **t**，得到最后的子区间 **0.354 到 0.372**。

![最终算法区间](./assets/arithimetic_range.png)

我们只需从最后的子区间 0.354 到 0.372 里选择一个数，让我们选择 0.36，不过我们可以选择这个子区间里的任何数。仅靠这个数，我们将可以恢复原始流 **eat**。就像我们在区间的区间里画了一根线来编码我们的流。

![最终区间横断面](./assets/range_show.png)

**反向过程**（又名解码）一样简单，用数字 **0.36** 和我们原始区间，我们可以进行同样的操作，不过现在是使用这个数字来还原被编码的流。

在第一个区间，我们发现数字落入了一个子区间，因此，这个子区间是我们的第一个字符，现在我们再次切分这个子区间，像之前一样做同样的过程。我们会注意到 **0.36** 落入了 **a** 的区间，然后我们重复这一过程直到得到最后一个字符 **t**（形成我们原始编码过的流 eat）。

编码器和解码器都**必须知道**字符概率表，因此，你也需要传送这个表。

一些[视频编解码器使用](https://en.wikipedia.org/wiki/Context-adaptive_binary_arithmetic_coding)这项技术（或至少提供这一选择）。

关于无损压缩量化比特流的办法，这里缺少了很多细节、原因、权衡等等。作为一个开发者你[可以学习更多内容](https://www.amazon.com/Understanding-Compression-Data-Modern-Developers/dp/1491961538/)。刚入门视频编码的人可以尝试使用不同的[熵编码算法，如ANS](https://en.wikipedia.org/wiki/Asymmetric_Numeral_Systems)。
#### 第六步 - 比特流格式

完成所有这些步之后，我们需要将**压缩过的帧和内容打包进去**。需要明确告知解码器**编码定义**，如颜色深度，颜色空间，分辨率，预测信息（运动向量，帧内预测方向），配置，层级，帧率，帧类型，帧号等等更多信息。

我们将简单地学习 H.264 比特流。我们使用下面的图片作为帧，生成一个具有**单个帧**，64x64 和颜色空间为 yuv420 的原始 h264 比特流。

![使用帧来生成极简 h264 比特流](./assets/minimal.png)

AVC (H.264) 标准规定信息将在宏帧（网络概念上的）内传输，称为 [NAL](https://en.wikipedia.org/wiki/Network_Abstraction_Layer)（网络抽象层）。NAL 的主要目标是提供“网络友好”的视频呈现方式，该标准必须适用于电视（基于流），互联网（基于数据包）等。

![H.264 NAL 单元](./assets/nal_units.png)

[同步标记](https://en.wikipedia.org/wiki/Frame_synchronization)用来定义 NAL 单元的边界。每个同步标记的值固定为  `0x00 0x00 0x01` ，最开头的标记例外，它的值是  `0x00 0x00 0x00 0x01` 。如果我们在生成的 h264 比特流上运行 **hexdump**，我们可以在文件的开头识别至少三个 NAL。

![NAL 单元上的同步标记](./assets/minimal_yuv420_hex.png)

解码器需要知道不仅仅是图片数据，还有视频的详细信息，如：帧、颜色、使用的参数等。每个 NAL 的**第一位**定义了其分类和**类型**。

| NAL type id  | 描述  |
|---  |---|
| 0  |  Undefined |
| 1  |  Coded slice of a non-IDR picture |
| 2  |  Coded slice data partition A |
| 3  |  Coded slice data partition B |
| 4  |  Coded slice data partition C |
| 5  |  **IDR** Coded slice of an IDR picture |
| 6  |  **SEI** Supplemental enhancement information |
| 7  |  **SPS** Sequence parameter set |
| 8  |  **PPS** Picture parameter set |
| 9  |  Access unit delimiter |
| 10 |  End of sequence |
| 11 |  End of stream |
| ... |  ... |

通常，比特流的第一个 NAL 是 **SPS**，这个类型的 NAL 负责传达通用编码参数，如**配置，层级，分辨率**等。

如果我们跳过第一个同步标记，就可以通过解码**第一个字节**来了解第一个 **NAL 的类型**。

例如同步标记之后的第一个字节是 `01100111`，第一位（`0`）是 **forbidden_zero_bit** 字段，接下来的两位（`11`）告诉我们是 **nal_ref_idc** 字段，其表示该 NAL 是否是参考字段，其余 5 位（`00111`）告诉我们是 **nal_unit_type** 字段，在这个例子里是 NAL 单元 **SPS** (7)。

SPS NAL 的第 2 位 (`binary=01100100, hex=0x64, dec=100`) 是 **profile_idc** 字段，显示编码器使用的配置，在这个例子里使用的是[受限高配置](https://en.wikipedia.org/wiki/H.264/MPEG-4_AVC#Profiles)，一种没有 B（双向预测） 切片支持的高配置。

![SPS 二进制视图](./assets/minimal_yuv420_bin.png)

如果我们再次使用二进制视图检查我们创建的视频 (ex: `xxd -b -c 11 v/minimal_yuv420.h264`)，可以跳到帧自身上一个 NAL。

![h264 idr 切片头](./assets/slice_nal_idr_bin.png)

我们可以看到最开始的 6 个字节：`01100101 10001000 10000100 00000000 00100001 11111111`。我们已经知道第一个字节告诉我们 NAL 的类型，在这个例子里， (`00101`) 是 **IDR 切片 (5)**，可以进一步检查它：

![h264 切片头规格](./assets/slice_header.png)

对照规范，我们能解码切片的类型（**slice_type**），帧号（**frame_num**）等重要字段。

为了获得一些字段（`ue(v), me(v), se(v) 或 te(v)`）的值，我们需要称为 [Exponential-Golomb](https://pythonhosted.org/bitstring/exp-golomb.html) 的特定解码器来解码它。当存在很多默认值时，这个方法编码变量值特别高效。

> 示例视频里 **slice_type** 和 **frame_num** 的值是 7（I 切片）和 0（第一帧）。

我们可以将**比特流视为一个协议**，如果你想学习更多关于比特流的内容，请参考 [ITU H.264 规范](http://www.itu.int/rec/T-REC-H.264-201610-I)。这个宏观图展示了图片数据（压缩过的 YUV）所在的位置。

![h264 比特流宏观图](./assets/h264_bitstream_macro_diagram.png "h264 比特流宏观图")

我们可以探究其它比特流，如 [VP9 比特流](https://storage.googleapis.com/downloads.webmproject.org/docs/vp9/vp9-bitstream-specification-v0.6-20160331-draft.pdf)，[H.265（HEVC）](http://handle.itu.int/11.1002/1000/11885-en?locatt=format:pdf)或是新的 [AV1 比特流](https://medium.com/@mbebenita/av1-bitstream-analyzer-d25f1c27072b#.d5a89oxz8)，[他们不相似](http://www.gpac-licensing.com/2016/07/12/vp9-av1-bitstream-format/)，但只要学习了其中之一，学习其他的就简单多了。

### 影响编码质量的因素

与任何编码一样，有两个基本因素会影响编码视频的大小和质量：源视频的格式和内容的详细信息，以及在对视频进行编码时使用的编解码器特性和配置。

一个普遍的规律是：使编码后的视频看起来更像原始的、未压缩的视频体积会更大。因此，始终要在尺寸与质量之间进行权衡。在某些情况下，为了减小体积而降低质量是值得的。其他情况下，质量的损失是不可接受的。并且我们必须接受会导致文件体积变大的编解码器配置。

此外，所有编解码器都有其优点和缺点。有些会在处理某种类型的形状和图案时表现糟糕，或者不擅长处理锋利的边缘、在黑暗区域丢失细节（或者其他条件下中丢失细节）。这一切都取决于编解码器使用的算法。 

#### 源视频格式和内容的影响

源视频格式和内容对编码视频质量和体积的影响。

<table>
 <thead>
  <tr>
   <th>特性</th>
   <th>对质量的影响</th>
   <th>对体积的影响</th>
  </tr>
 </thead>
 <tbody>
  <tr>
   <th>颜色深度</th>
   <td>颜色位深越高，视频中颜色保真度质量就越高。除此之外，在图像饱和部分，低于每分量 10 色深允许条带化，如果没有可见色阶跃就无法表示渐变。</td>
   <td>较高的颜色深度可能会导致较大的压缩体积。决定因素是压缩数据使用哪种内部存储格式。</td>
  </tr>
  <tr>
   <th>帧率</th>
   <td>影响图像运动的感知平滑度。在某种程度上，帧率越高，运动就会显得越平滑，越真实。</td>
   <td>在编码期间不降低帧率，则较高的帧率会导致压缩的视频体积更大。</td>
  </tr>
  <tr>
   <th>运动</th>
   <td>视频压缩通常通过比较帧，找到它们之间的差异以及构造包含足够信息以更新前一帧以近似下一帧的外观的记录来进行。连续的帧越不同，差异越大，压缩效果越差，而且越难避免将伪像引入压缩视频中。</td>
   <td>由运动引入的复杂性导致较大的中间帧，这是因为帧之间的差异数量更多。 由于这个和其他原因，视频中的运动越多，输出文件通常会越大。</td>
  </tr>
  <tr>
   <th>噪点</th>
   <td>图片噪点（例如胶片颗粒效果，灰尘或图像的其他粗糙感）会引入可变性。可变性通常会使压缩更加困难，由于需要删除细节以实现相同的压缩级别，导致质量损失更大。</td>
   <td>图像中存在较大的可变性（例如噪点），压缩过程越复杂，算法将图像压缩到相同程度的成功可能性就越小。除非您以忽略噪点引起的部分（或全部变化）的方式配置编码器，否则压缩后的视频会更大。</td>
  </tr>
  <tr>
   <th>分辨率</th>
   <td>以相同的屏幕尺寸呈现的高分辨率视频通常可以更准确地描绘原始场景。</td>
   <td>视频的分辨率越高，最终输出的视频的分辨率就越高。这在视频的最终体积上起着关键的作用。</td>
  </tr>
 </tbody>
</table>

这些影响最终编码视频的程度取决于具体细节，包括您使用的编码器及其配置方式。除了常规编解码器选项外，还可以将编码器配置为降低码率、清除噪点或降低编码过程中视频的整体分辨率。

#### 编解码器配置的影响

视频编码器配置对编码视频质量和体积的影响。

用于对视频进行编码的算法通常使用一种或多种技术来执行其编码。
一般而言，任何减小视频输出体积的配置选项都可能会对视频的整体质量产生负面影响，或者将某些类型的伪像引入视频中。
还可以选择无损编码形式，这将导致编码文件体积很大，但解码时可以完美再现原始视频。

另外，每个编码器在处理源视频的方式上可能会有所不同，从而导致输出质量或体积上的差异。

<table>
 <thead>
  <tr>
   <th>特性</th>
   <th>对质量的影响</th>
   <th>对体积的影响</th>
  </tr>
 </thead>
 <tbody>
  <tr>
   <th>无损压缩</th>
   <td>没有质量损失</td>
   <td>无损压缩无法像有损压缩一样减少整体视频体积。生成的文件对于一般用途而言可能仍然太大。</td>
  </tr>
  <tr>
   <th>有损压缩</th>
   <td>在某种程度上，会出现伪影和其他形式的质量下降，具体取决于编解码器以及压缩程度。</td>
   <td>编码的视频能够接受与源的差异越多，实现更高的压缩率就越容易。</td>
  </tr>
  <tr>
   <th>质量设置</th>
   <td>质量配置得越高，编码后的视频看起来就越像原始视频。</td>
   <td>通常较高的质量设置将导致较大的编码视频文件；程度取决于编解码器实现。</td>
  </tr>
  <tr>
   <th>比特率</th>
   <td>更高的比特率通常会提高质量。</td>
   <td>更高的比特率会需要更大的体积。</td>
  </tr>
 </tbody>
</table>

每一个编解码器的选项和对应值都有所不同，这取决于编解码器软件。可以查看具体的编解码器文档来了解这些选项对编码视频的影响。

### 常用的编码格式

以下视频编码格式是目前最常用的视频编码格式。对于每个编码格式，还列出了可以支持它们的容器格式（文件类型）。

<table>
 <thead>
  <tr>
   <th>缩写</th>
   <th>全称</th>
   <th>支持的容器</th>
  </tr>
 </thead>
 <tbody>
  <tr>
   <th><a>AV1</a></th>
   <td>AOMedia Video 1</td>
   <td><a>MP4</a>, <a>WebM</a></td>
  </tr>
  <tr>
   <th><a>AVC (H.264)</a></th>
   <td>Advanced Video Coding</td>
   <td><a>3GP</a>, <a>MP4</a>, <a>WebM</a></td>
  </tr>
  <!-- <tr>
   <th><a>H.263</a></th>
   <td>H.263 Video</td>
   <td><a>3GP</a></td>
  </tr> -->
  <tr>
   <th><a>HEVC (H.265)</a></th>
   <td>High Efficiency Video Coding</td>
   <td><a>MP4</a></td>
  </tr>
  <!-- <tr>
   <th><a>MP4V-ES</a></th>
   <td>MPEG-4 Video Elemental Stream</td>
   <td><a>3GP</a>, <a>MP4</a></td>
  </tr> -->
  <!-- <tr>
   <th><a>MPEG-1</a></th>
   <td>MPEG-1 Part 2 Visual</td>
   <td><a>MPEG</a>, <a>QuickTime</a></td>
  </tr>
  <tr>
   <th>MPEG-2</th>
   <td>MPEG-2 Part 2 Visual</td>
   <td><a>MP4</a>, <a>MPEG</a>, <a>QuickTime</a></td>
  </tr> -->
  <!-- <tr>
   <th><a>Theora</a></th>
   <td>Theora</td>
   <td><a>Ogg</a></td>
  </tr> -->
  <!-- <tr>
   <th><a>VP8</a></th>
   <td>Video Processor 8</td>
   <td><a>3GP</a>, <a>Ogg</a>, <a>WebM</a></td>
  </tr> -->
  <tr>
   <th><a>VP9</a></th>
   <td>Video Processor 9</td>
   <td><a>MP4</a>, <a>Ogg</a>, <a>WebM</a></td>
  </tr>
 </tbody>
</table>

### 选择合适的编码格式

考虑使用哪种编码格式的参考维度：

- *开放格式* 还是*专有格式* * ？
- 是否可以为视频提供一种以上的格式？使用备选功能可以极大地简化决策过程。
- 用户主要使用的浏览器的有哪些？
- 需要对的旧版本的浏览器兼容到怎样的程度？例如，是否需要在过去 5 年或仅仅一年内使用的所有浏览器上工作？

在下面的内容中，我们提供了针对特定场景的推荐编码格式选择。对于每个场景，我们提供了两个建议。如果最适合的编码格式是需要专利权使用费，则为一个视频提供两种格式：首先是开放和免专利费的，其次是需要专利费的。

如果你只能提供单个版本，则可以选择最适的格式。建议首先是选择质量、性能和兼容性综合下最好的格式。其次是选择兼容性最广泛的格式，但要牺牲一些质量，性能或体积。

#### 主流场景

首先看一下在典型网站（例如博客、信息站点、小型企业网站）上呈现的视频的最佳选择。在该网站上，视频用于演示产品（而不是视频本身就是产品）。

1. WebM 容器，视频使用 **VP8 编码格式**，音频使用 Opus 编码格式。这些都是开放的，免专利费的格式，但只有在最新的浏览器中才得到很好的支持；
    ```html
    <video controls src="filename.webm"></video>
    ```
2. MP4 容器，视频使用 **AVC（H.264）编码格式**，音频使用 AAC 编码格式。主流浏览器都对 MP4 容器中使用 AVC 和 AAC 编码格式的提供了支持，相对于其他编码格式，该选择质量通常而言是最好的。
    ```html
    <video controls>
      <source type="video/webm" src="filename.webm">
      <source type="video/mp4" src="filename.mp4">
    </video>
    ```

#### 高质量场景

如果是要以更高的质量显示视频，则需要提供尽可能多的格式，因为具有最佳质量的编码格式也往往是最新的，因此可能在浏览器中得不到支持。

1. WebM 容器，视频使用 **AV1 编码格式**，音频使用 Opus 编码格式。如果在对 AV1 进行编码时可以使用“高级”或“专业”配置文件，例如使用 6.3 级别，可以在保持出色视频质量的同时以 4K 或 8K 分辨率获得很高的比特率；
2. MP4 容器，视频使用 **HEVC 编码格式**，音频以高采样率（至少 48 kHz，理想情况下为 96 kHz）使用 AAC 编码格式，并以「复杂」而非「快速」模式进行编码。

#### 存档或编辑场景

当前的浏览器中通常没有对无损视频编码格式提供支持。原因很简单：这样的视频很大。例如，使用 `4：2：0` 色度二次采样的未压缩 1080p 视频至少需要 1.5 Gbps。使用无损压缩（例如 FFV1，浏览器不支持）可能可以将其降低到大约 600 Mbp。这个数据依旧很大，在现行的网络环境下进行播放完全不可行。

但有些情况，你可能会需要无损编码格式的视频。例如用于下载存档，或者录制视频。

##### 存档视频

要提供用于存档的视频，可以使用例如 [x264](https://www.videolan.org/developers/x264.html) 的应用程序以很高的比特率将视频编码为 **AVC 格式**：

```bash
x264 --crf 18 -preset ultrafast --output outFilename.mp4 inputFile
```

##### 录制影片

要获得接近无损的质量，你可以考虑使用 **AVC 或 AV1 编码格式**。例如，如果是使用 `MediaStream Recording API` 录制视频，则在创建 `MediaRecorder` 对象时可以参考以下示例代码：

```js
const kbps = 1024;
const Mbps = kbps*kbps;

const options = {
  mimeType: 'video/webm; codecs="av01.2.19H.12.0.000.09.16.09.1, flac"',
  bitsPerSecond: 800*Mbps,
};

let recorder = new MediaRecorder(sourceStream, options);
```

这个示例创建了一个 `MediaRecorder` 对象，其配置为：

- AV1 视频编码格式
- 使用 12 位颜色深度
- 用于 HDR 的 BT.2020 颜色
- 以 4：4：4 色度子采样
- FLAC 音频编码格式
- 在视频和音频轨道之间共享的不超过 800 Mbps 的比特率

你可能需要根据硬件性能、具体需求和使用的特定编解码格式来调整这些值。这样比特率对于网络传输显然是不现实的，该仅适合在本地使用。

`codecs` 参数以小数点来分隔标识属性值，示例中 `av01.2.19H.12.0.000.09.16.09.1` 值对应的含义如下：

<table>
 <thead>
  <tr>
   <th>值</th>
   <th>描述</th>
  </tr>
 </thead>
 <tbody>
  <tr>
   <td><code>av01</code></td>
   <td>表示使用 AV1 编码格式。</td>
  </tr>
  <tr>
   <td><code>2</code></td>
   <td>profile 类型。2 表示“专业”。 1 表示高级，0 表示主要。</td>
  </tr>
  <tr>
   <td><code>19H</code></td>
   <td>级别和层级。来自 AV1 规范的<a href="https://aomediacodec.github.io/av1-spec/#levels">第 A.3 小节</a>，该值表示使用 6.3 级的较高级别。</td>
  </tr>
  <tr>
   <td><code>12</code></td>
   <td>颜色深度。可用的值还有 8 和 10，12 是 AV1 中可用的最高值。</td>
  </tr>
  <tr>
   <td><code>0</code></td>
   <td>单色模式标志。如果为 1，则不会记录任何色度平面，所有数据亮度数据，从而产生灰度图像。指定 0 代表想要颜色。</td>
  </tr>
  <tr>
   <td><code>000</code></td>
   <td>色度子采样模式，来自 AV1 规范的<a href="https://aomediacodec.github.io/av1-spec/#color-config-semantics">第 6.4.2 小节</a>。值为 000，再加上 单色模式值 0，则表明要使用 `4：4：4` 色度子采样。</td>
  </tr>
  <tr>
   <td><code>09</code></td>
   <td>要使用的原色。来自 AV1 规范中的第 6.4.2 小节。9 表示要使用用于 HDR 的 BT.2020 颜色。</td>
  </tr>
  <tr>
   <td><code>16</code></td>
   <td>要使用的传输特性。也来自第 6.4.2 小节。16 表示要使用 BT.2100 PQ 颜色的特征。</td>
  </tr>
  <tr>
   <td><code>09</code></td>
   <td>转换用的矩阵系数，也来自第 6.4.2 小节。9 表示要使用亮度可变的 BT.2020。</td>
  </tr>
  <tr>
   <td><code>1</code></td>
   <td>“颜色范围”，1 表示要使用全部色彩范围。</td>
  </tr>
 </tbody>
</table>


## 视频容器

### 什么是容器格式

又称封装格式，是把已经编码封装好的视频、音频按照一定的规范放在一起的组织方式（例如有些容器格式规定文件内容分为头部、主体、索引三部分），容器中可能还有字幕、脚本等内容。

同一种容器格式中可以放不同编码的视频，通常一种视频容器格式一般只支持某几类编码格式的视频。

### 常用的容器格式

下面列出了常用的容器格式。一些仅支持音频，而另一些同时支持音频和视频。

<table>
 <thead>
  <tr>
   <th>缩写</th>
   <th>全称</th>
   <th>MIME 类型</th>
   <th>支持的编解码器</th>
   <th>浏览器兼容性</th>
  </tr>
 </thead>
 <tbody>
  <!-- <tr>
   <th><a>ADTS</a></th>
   <td>Audio Data Transport Stream</td>
   <td>audio/aac, audio/mpeg</td>
   <td>AAC, MP3</td>
   <td>Firefox</td>
  </tr> -->
  <!-- <tr>
   <th><a>FLAC</a></th>
   <td>Free Lossless Audio Codec</td>
   <td>audio/flac, audio/x-flac (non-standard)</td>
   <td>FLAC</td>
   <td>Chrome 56, Edge 16, Firefox 51, Safari 11</td>
  </tr> -->
  <!-- <tr>
   <th><a>MPEG / MPEG-2</a></th>
   <td>Moving Picture Experts Group (1 and 2)</td>
   <td>video/mpeg</td>
   <td>MPEG-1 Part 2, MPEG-2 Part 2</td>
   <td>—</td>
  </tr> -->
  <tr>
   <th><a>MPEG-4 (MP4)</a></th>
   <td>Moving Picture Experts Group 4</td>
   <td>video/mp4</td>
   <td>AVC (H.264), AV1, H.263, VP9</td>
   <td>Chrome 3, Edge 12, Firefox, Internet Explorer 9,&nbsp;Opera 24, Safari 3.1</td>
  </tr>
  <tr>
   <th><a>WebM</a></th>
   <td>Web Media</td>
   <td>video/webm</td>
   <td></td>
   <td>Chrome 6, Edge 17&nbsp;(desktop only), Firefox 4, Opera 10.6, Safari (WebRTC only)</td>
  </tr>
  <tr>
   <th><a>QuickTime (MOV)</a></th>
   <td>Apple QuickTime movie</td>
   <td>video/quicktime</td>
   <td>-</td>
   <td>-</td>
  </tr>
  <tr>
  <tr>
   <th><a>Ogg</a></th>
   <td>Ogg</td>
   <td>video/ogg</td>
   <td>Theora, VP8, VP9</td>
   <td>Chrome 3, Firefox 3.5, Edge 17&nbsp;(desktop only), Internet Explorer 9, Opera&nbsp;10.50</td>
  </tr>
   <th><a>3GP</a></th>
   <td>Third Generation Partnership</td>
   <td>video/3gpp, video/3gpp2, video/3gp2</td>
   <td>AVC (H.264), H.263, MPEG-4 Part 2 (MP4v-es), VP8</td>
   <td>Firefox for Android</td>
  </tr>
 </tbody>
</table>

### 选择合适的容器格式

选择媒体的容器时，需要考虑两个比较重要的因素：*版权要求* * 以及目标受众的兼容性要求。

#### 指导方针

- 如果目标受众是使用移动设备的用户，特别是在低端设备或慢速网络上的用户，则在 3GP 容器中提供经过压缩的版本。
- 如果有任何特定的编码要求，请确保选择的容器支持相应的编解码器。
- 如果希望采用非专有格式*，则需要使用开放格式*的容器，例如 WebM。
- 如果只能提供一种容器格式的媒体，则选择在最广泛的设备和浏览器上可用的格式，例如 MP4。
- 如果媒体是纯音频的，则选择纯音频的容器格式。MP3 是一种受到广泛支持的不错选择。WAVE 兼容性也不错，但未压缩，因此不适合将其用于大型音频。如果目标浏览器都支持 FLAC，则由于其无损压缩，是一个非常好的选择。

#### 容器选择建议

<table>
 <thead>
  <tr>
   <th>如果你需要...</th>
   <th>考虑使用此容器格式</th>
  </tr>
  <tr>
   <td>通用视频，最好是开放格式</td>
   <td>WebM (兜底方案：MP4)</td>
  </tr>
  <tr>
   <td>通用视频</td>
   <td>MP4 (兜底方案：WebM 或 Ogg)</td>
  </tr>
  <tr>
   <td>高压缩率优化用于低速的网络环境</td>
   <td>3GP (兜底方案：MP4)</td>
  </tr>
  <tr>
   <td>良好的旧设备/浏览器兼容性</td>
   <td>QuickTime (兜底方案：AVI 或 MPEG-2)</td>
  </tr>
 </thead>
</table>

## Web 中的多媒体 API(TODO)

- Buffer
- Track
- MediaStream
- Blob

## 参考资料

- [Wikipedia: Video file format](https://en.wikipedia.org/wiki/Video_file_format)
- [Digital video concepts](https://developer.mozilla.org/en-US/docs/Web/Media/Formats/Video_concepts)：探讨有助于理解视频的重要概念，以便能够掌握如何处理网络上的视频。
- [网络视频编解码器指南](https://developer.mozilla.org/zh-CN/docs/Web/Media/Formats/%E8%A7%86%E9%A2%91%E7%BC%96%E8%A7%A3%E7%A0%81%E5%99%A8)：提供有关主要浏览器支持的视频编解码器的基本信息，以及一些不普遍支持但仍可能会遇到的视频编解码器。还涵盖了编解码器功能，优势，限制以及浏览器支持级别和限制相关内容。
- [多媒体容器格式](https://developer.mozilla.org/zh-CN/docs/Web/Media/Formats/Containers)：通用的多媒体容器的优点、局限性以及用法。 
- [The "codecs" parameter in common media types](https://developer.mozilla.org/en-US/docs/Web/Media/Formats/codecs_parameter)：当指定描述媒体格式的 MIME 类型时，可以使用 `codecs` 参数作为类型字符串的一部分来提供详细信息。本指南描述了 `codecs` 常见媒体类型的参数的格式和可能的值。