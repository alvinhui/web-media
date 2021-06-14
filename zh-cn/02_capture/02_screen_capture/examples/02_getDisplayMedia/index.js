const videoElem = document.getElementById('video');
const logElem = document.getElementById('log');
const startElem = document.getElementById('start');
const stopElem = document.getElementById('stop');

startElem.addEventListener('click', startCapture, false);
stopElem.addEventListener('click', stopCapture, false);

console.error = msg => logElem.innerHTML += `<span class="error">${msg}</span><br>`;
console.warn = msg => logElem.innerHTML += `<span class="warn">${msg}<span><br>`;
console.info = msg => logElem.innerHTML += `<span class="info">${msg}</span><br>`;

async function startCapture() {
  logElem.innerHTML = '';

  try {
    var displayMediaOptions = {
      video: {
        cursor: 'never',
      },
      audio: true
    };
    videoElem.srcObject = await navigator.mediaDevices.getDisplayMedia(displayMediaOptions);
    dumpOptionsInfo();
  } catch(err) {
    console.error('Error: ' + err);
  }
}

function stopCapture(evt) {
  let tracks = videoElem.srcObject.getTracks();

  tracks.forEach(track => track.stop());
  videoElem.srcObject = null;
}

function dumpOptionsInfo() {
  const videoTrack = videoElem.srcObject.getVideoTracks()[0];
  console.info('Track settings:');
  console.info(JSON.stringify(videoTrack.getSettings(), null, 2));
  console.info('Track constraints:');
  console.info(JSON.stringify(videoTrack.getConstraints(), null, 2));
}