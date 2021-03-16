let conn;
function createConn(connection) {
  conn = connection;
  conn.on('close', showCallContent);
}

const hangUpBtn = document.querySelector('.hangup-btn');
const audioContainer = document.querySelector('.call-container');
const callBtn = document.querySelector('.call-btn');

function showCallContent() {
  window.caststatus.textContent = `Your device ID is: ${peer.id}`;
  callBtn.hidden = false;
  audioContainer.hidden = true;
}

function showConnectedContent() {
  window.caststatus.textContent = `You're connected`;
  callBtn.hidden = true;
  audioContainer.hidden = false;
}

const peer = new Peer(''+Math.floor(Math.random()*2**18).toString(36).padStart(4,0), {
  host: location.hostname,
  debug: 1,
  path: '/myapp'
});
peer.on('open', showCallContent);
peer.on('connection', createConn);
peer.on('call', function(call) {
  const answerCall = confirm('Do you want to answer?')
  if(answerCall){
    call.answer(window.localStream) // A
    showConnectedContent(); // B
    call.on('stream', function(stream) { // C
       window.remoteAudio.srcObject = stream;
       window.remoteAudio.autoplay = true;
       window.peerStream = stream;
    });
  } else {
    console.log('call denied'); // D
  }
});

callBtn.addEventListener('click', function(){
  const code = window.prompt('Please enter the sharing code');;
  createConn(peer.connect(code));
  const call = peer.call(code, window.localStream);
  call.on('stream', function(stream) {
    window.remoteAudio.srcObject = stream;
    window.remoteAudio.autoplay = true;
    window.peerStream = stream;
    showConnectedContent();
  })
});

hangUpBtn.addEventListener('click', function (){
  conn && conn.close();
});

function getLocalStream() {
  navigator.mediaDevices.getUserMedia({video: false, audio: true}).then( stream => {
    window.localStream = stream;
    window.localAudio.srcObject = stream;
    window.localAudio.autoplay = true;
  }).catch( err => {
    console.log('u got an error:' + err)
  });
}
getLocalStream();