(function() {
  window.addEventListener('load', function() {

    // 设置拍摄照片的宽度和高度，这里设置宽度固定值，高度基于输入流的纵横比计算得出。
    var width = 320;
    var height = 0;

    // 当前是否有活动的视频流正在运行
    var streaming = false;

    // 我们需要控制的各种 HTML 元素的引用
    var video = document.getElementById('video');
    var canvas = document.getElementById('canvas');
    var photo = document.getElementById('photo');
    var startButton = document.getElementById('startButton');

    // 请求访问用户的摄像头
    navigator.mediaDevices.getUserMedia({video: true, audio: false})
      .then(function(stream) {
        video.srcObject = stream; // 将获取到媒体流作为视频元素的源
        video.play();
      })
      .catch(function(err) { // 在没有连接兼容的相机，或者用户拒绝访问时，会进入这个逻辑块。
        alert('发生了一个错误： ' + err);
      });

    // 视频开始播放时设置页面上相关元素的宽高
    video.addEventListener('canplay', function(ev){
      if (!streaming) {
        height = video.videoHeight / (video.videoWidth /  width);
  
        video.style.width = width + 'px';
        video.style.height = height + 'px';
        canvas.style.width = width + 'px';
        canvas.style.height = height + 'px';
        photo.style.width = width + 'px';
        photo.style.height = height + 'px';
        streaming = true;
      }
    }, false);

    // 按钮点击，从视频流中捕获图像
    startButton.addEventListener('click', function(ev){
      ev.preventDefault();
      var context = canvas.getContext('2d');
      canvas.width = width;
      canvas.height = height;
      
      context.drawImage(video, 0, 0, width, height); // 获取视频的当前内容并将其绘制到画布中
    
      var data = canvas.toDataURL('image/png');
      photo.setAttribute('src', data);
    }, false);
  }, false);
})();