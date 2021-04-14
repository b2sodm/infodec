
var chatsignalurl = 'http://localhost:8880';
var chatconfig = {};
var chatstream;
var chatstream2 = document.getElementById("vchat2").srcObject

var socket = io(chatsignalurl, {autoConnect: false});
socket.on('data', (data) => {
    console.log('Chat: ', data);
    chatSignal(data);
});

socket.on('ready', () => {
    consol.log('Socket ready: ');
    chatPeers();
    chatOffer();
});

function chatData (data){
    socket.emit('data', data);
}

var poptions = {audio: false, video: true};
var mediaoptions = {
    audio: true,
    video: true
};

var done = 0;

function pcamera(){
    done = 1;
    if (!navigator.getUserMedia){
        console.log("Camera device not supported.")
        navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
        console.log('Done:', navigator.getUserMedia)
    }
    if(navigator.getUserMedia){
        navigator.getUserMedia(poptions, success, function(e) {
           console.log(e);
        });
    }
    function success(stream){
        var video = document.querySelector('#vchat3');
        video.src = window.URL.createObjectURL(stream);
    }
}

function chat(){
    try {
        navigator.mediaDevices.getUserMedia(mediaoptions)
    		    .then(streamA => {
                chatstream = streamA;
    		        document.getElementById("vchat1").srcObject = streamA;
    		        console.log("Video online.");
                //streamA.getTracks().forEach(track => myPeerConnection.addTrack(track, streamA));
                //console.log("Audeo online.");
                socket.connect();
    		    })
    		    .catch(err => {
    		          console.log('navigator.getUserMedia, 01: ', err);
                  if(done = 0){
                    //pcamera();
                  }
    		    });
    } catch (e) {
    	console.log("ErrorCamera, 02: ", e)
      if(done = 0){
        //pcamera();
      }
    } finally {
    	console.log("Done: ", done)
    }
}

function chatPeers(){
    try {
      pc = new RTCPeerConnection(chatconfig);
      pc.onicecandidate = onIceCandidate;
      pc.onaddstream = onAddStream;
      pc.addStream(chatstream);
      console.log('Peer connected.');
    } catch (e) {
      console.log('Peer error: ', e)
    } finally {
      console.log("ChatPeer....")
    }
}

function chatOffer(){
    console.log("Chat offer: ");
    pc.createOffer().then(
        chatLocalDescription,
        (error) => { console.log("Chat offer: ", error); }
    );
}

function chatAnswer(){
    console.log("Chat answer: ");
    pc.createAnswer().then(
      chatLocalDescription,
      (error) => { console.log("Chat answer: ", error); }
    );
}

function chatLocalDescription(session){
    pc.setLocalDescription(session);
    console.log('Set Local Description: ');
    chatData(session);
}

function onIceCandidate(event){
    if (event.candidate) {
        console.log("Ice: ");
        chatData({type: 'candidate', candidate: event.candidate});
    }
}

function onAddStream(event){
    console.log("Stream: ");
    chatstream2 = event.stream
}

function chatSignal(data){
    switch (data.type) {
      case 'offer':
        chatPeers();
        pc.setRemoteDescription(new RTCSessionDescription(data));
        chatAnswer();
        break;
      case 'candidate':
        pc.addIceCandidate(new RTCIceCandidate(data.candidate));
        break;
    }
}

console.log("#1 Chat online...");
chat();
console.log("#2 Chat online...");
