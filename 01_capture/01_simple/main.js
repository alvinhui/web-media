window.addEventListener('load', function() {

  // 设置拍摄照片的宽度和高度，这里设置宽度固定值，高度基于输入流的纵横比计算得出。
  var width = 320;
  var height = 0;

  // 我们需要控制的 video 元素的引用
  var video = document.getElementById('video');

  // 请求访问用户的摄像头
  navigator.mediaDevices.getUserMedia({video: true, audio: false})
    .then(function(stream) {
      video.srcObject = stream; // 将获取到媒体流作为视频元素的源
      video.play();
    })
    .catch(function(err) { // 在没有连接兼容的相机，或者用户拒绝访问时，会进入这个逻辑块。
      alert('发生了一个错误： ' + err);
    });

  // 视频开始播放时根据媒体输入流设置 video 元素的宽高
  video.addEventListener('canplay', function(ev){
    height = video.videoHeight / (video.videoWidth /  width);
    video.style.width = width + 'px';
    video.style.height = height + 'px';
    streaming = true;
  }, false);

  // 按钮点击，从视频流中捕获图像
  document.getElementById('startButton').addEventListener('click', function(ev){
    ev.preventDefault();
    var canvas = document.getElementById('canvas');
    canvas.width = width;
    canvas.height = height;
    canvas.getContext('2d').drawImage(video, 0, 0, width, height);

    var photo = document.getElementById('photo');
    photo.style.width = width + 'px';
    photo.style.height = height + 'px';
    photo.setAttribute('src', canvas.toDataURL('image/png'));
  }, false);
}, false);