const videoElem = document.getElementById('video');
const logElem = document.getElementById('log');
const startElem = document.getElementById('start');
const stopElem = document.getElementById('stop');

startElem.addEventListener('click', startCapture, false);
stopElem.addEventListener('click', stopCapture, false);

const error = msg => logElem.innerHTML += `<span class="error">${msg}</span><br>`;
const info = msg => logElem.innerHTML += `<span class="info">${msg}</span><br>`;

async function startCapture() {
  logElem.innerHTML = '';

  try {
    const displayMediaOptions = {
      video: {
        cursor: 'never',
      },
      audio: true
    };
    videoElem.srcObject = await navigator.mediaDevices.getDisplayMedia(displayMediaOptions);
    dumpOptionsInfo();
  } catch(err) {
    error('Error: ' + err);
  }
}

function stopCapture() {
  const tracks = videoElem.srcObject.getTracks();
  tracks.forEach(track => track.stop());
  videoElem.srcObject = null;
}

function dumpOptionsInfo() {
  const videoTrack = videoElem.srcObject.getVideoTracks()[0];
  info('Track settings:');
  info(JSON.stringify(videoTrack.getSettings(), null, 2));
  info('Track constraints:');
  info(JSON.stringify(videoTrack.getConstraints(), null, 2));
}