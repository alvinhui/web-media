window.addEventListener('load', function() {

  // 设置拍摄照片的宽度和高度，这里设置宽度固定值，高度基于输入流的纵横比计算得出。
  var width = 320;
  var height = 0;

  // 声明需要操作的元素
  var video = document.getElementById('video');
  var img = document.getElementById('img');
  var canvas = document.getElementById('canvas');
  var recording = document.getElementById('recording');
  var recordButton = document.getElementById('recordButton');
  var downloadButton = document.getElementById('downloadButton');

  // 声明一些中间变量
  var imageCapture;
  var mediaRecorder;
  var recordedBlobs = [];

  // 请求访问用户的摄像头
  navigator.mediaDevices.getUserMedia({video: true, audio: true})
    .then(function(stream) {
      // 将获取到媒体流作为视频元素的源
      video.srcObject = stream;
      video.play();
      imageCapture = new ImageCapture(stream.getVideoTracks()[0]); 
    })
    .catch(function(err) {
      // 在没有连接兼容的相机，或者用户拒绝访问时，会进入这个逻辑块。
      alert('发生了一个错误： ' + err);
    });

  // 获取到视频的元数据后根据媒体输入流设置 video 元素的宽高
  video.addEventListener('loadedmetadata', function(ev){
    console.log('video.videoWidth', video.videoWidth);
    height = video.videoHeight / (video.videoWidth /  width);
    video.style.width = width + 'px';
    video.style.height = height + 'px';
    canvas.width = width;
    canvas.height = height;
    img.style.width = width + 'px';
    img.style.height = height + 'px';
  }, false);

  document.getElementById('screenshotButton').addEventListener('click', function(ev){
    ev.preventDefault();
    grabFrame();
    // takePhoto();
  }, false);

  recordButton.addEventListener('click', function() {
    recordButton.attributes.recording
    if (recordButton.textContent === '录制') {
      startRecording();
    } else {
      stopRecording();
    }
  }, false);

  downloadButton.addEventListener('click', function download() {
    var blob = new Blob(recordedBlobs, {type: 'video/webm'});
    var url = window.URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = 'test.webm';
    document.body.appendChild(a);
    a.click();
    setTimeout(function() {
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }, 100);
  }, false);

  function startRecording() {
    recordButton.textContent = '停止';
    recordedBlobs = [];
    mediaRecorder = new MediaRecorder(video.captureStream(), {mimeType: 'video/webm;codecs=vp9', bitsPerSecond: 100000});
    downloadButton.disabled = true;
    mediaRecorder.onstop = function() {
      var type = (recordedBlobs[0] || {}).type;
      var superBuffer = new Blob(recordedBlobs, { type });
      recording.src = URL.createObjectURL(superBuffer);
    };
    mediaRecorder.ondataavailable = function(event) {
      if (event.data && event.data.size > 0) {
        recordedBlobs.push(event.data);
      }
    }
    mediaRecorder.start();
  }

  function stopRecording() {
    mediaRecorder && mediaRecorder.stop();
    downloadButton.disabled = false;
    recordButton.textContent = '录制';
  }

  function grabFrame() {
    setCanvasAndPhoto(video);
    // imageCapture.grabFrame().then(function(imageBitmap) {
    //   setCanvasAndPhoto(imageBitmap);
    // }).catch(function(error) {
    //   console.error('grabFrame() error: ', error);
    // });
  }

  function takePhoto() {
    imageCapture.takePhoto({width, height}).then(function(blob) {
      img.src = URL.createObjectURL(blob);
    }).catch(function(error) {
      console.error('takePhoto() error: ', error);
    });
  }

  function setCanvasAndPhoto(media) {
    canvas.getContext('2d').drawImage(media, 0, 0, width, height);
    img.src = canvas.toDataURL('image/png');
  }

}, false);