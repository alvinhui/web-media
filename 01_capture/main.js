(function() {
  // 拍摄照片的宽度和高度，这里设置宽度固定值，高度基于输入流的纵横比计算得出。
  var width = 320;
  var height = 0;

  // 标识当前是否正在从设备流式中传输视频流
  var streaming = false;

  // 我们需要配置或控制的各种 HTML 元素
  var video = null;
  var canvas = null;
  var photo = null;
  var startButton = null;

  function startup() {
    video = document.getElementById('video');
    canvas = document.getElementById('canvas');
    photo = document.getElementById('photo');
    startButton = document.getElementById('startButton');

    // 将捕获到的媒体流放入视频元素进行渲染
    navigator.mediaDevices.getUserMedia({video: true, audio: false})
      .then(function(stream) {
        video.srcObject = stream;
        video.play();
      })
      .catch(function(err) {
        alert('发生了一个错误： ' + err);
      });

    // 视频开始播放时设置页面上相关元素的宽高
    video.addEventListener('canplay', function(ev){
      if (!streaming) {
        height = video.videoHeight / (video.videoWidth /  width);
      
        // Firefox 有一个无法从视频中读取高度的错误，这里我们按照一定的比例设置高度进行兼容。
        if (isNaN(height)) {
          height = width / (4/3);
        }
      
        video.setAttribute('width', width);
        video.setAttribute('height', height);
        canvas.setAttribute('width', width);
        canvas.setAttribute('height', height);
        streaming = true;
      }
    }, false);

    // 按钮点击，从视频流中截取图像
    startButton.addEventListener('click', function(ev){
      takePicture();
      ev.preventDefault();
    }, false);
    
    clearPhoto();
  }

  function clearPhoto() {
    var context = canvas.getContext('2d');
    context.fillStyle = "#AAA";
    context.fillRect(0, 0, canvas.width, canvas.height);

    var data = canvas.toDataURL('image/png');
    photo.setAttribute('src', data);
  }
  
  // 通过获取视频的当前内容并将其绘制到画布中，画布将其转换为 PNG 格式的图像数据。
  // 然后将图像数据赋值到屏幕上的 image 元素，由其来最终渲染图像。
  function takePicture() {
    var context = canvas.getContext('2d');
    if (width && height) {
      canvas.width = width;
      canvas.height = height;
      context.drawImage(video, 0, 0, width, height);
    
      var data = canvas.toDataURL('image/png');
      photo.setAttribute('src', data);
    } else {
      clearPhoto();
    }
  }

  // 页面加载完成，启动捕获程序
  window.addEventListener('load', startup, false);
})();