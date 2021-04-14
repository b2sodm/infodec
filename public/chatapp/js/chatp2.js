///////////////////////////////
// chatp2.js
// Author: Brian M
///////////////////////////////

var phost = "localhost";
var appport = 9000;
var httpsport = 9090;
var peerport = 9080;
var pport = peerport;
var wsport = appport;
var wssport = httpsport;
var ppath = '/pchatapp';
var host = location.origin.replace(/^http/, 'ws');
console.log("Host: ", host)
var path = 'ws://'+phost+':'+wsport;
var pathX2 = 'wss://'+phost+':'+wssport;
var alias = document.getElementById('alias').value;
var chatalias = document.getElementById('chatalias').value;
var guestalias = document.getElementById('guestalias').value;
var chattoken = document.getElementById('chattoken').value;
var projectrefnumber = document.getElementById('projectrefnumber').value;
var projectname = document.getElementById('subject').value;
var jobrefnumber = document.getElementById('jobrefnumber').value;
var ptime = document.getElementById('ptime');
var pduration = document.getElementById('chatduration').value;
var chatdate = document.getElementById('chatdate').value;
var ddate = document.getElementById('ddate').value;
var pinbox = document.getElementById('pinbox');
ptime.innerHTML = 'Server Time: ';
var ctime = 0;
pduration += 300;

var chatid = chattoken;
var chatid2 = projectrefnumber;
if (alias == chatalias) {
    chatid = projectrefnumber;
    chatid2 = chattoken;
}
var peer;
var conn1;
var done = 0;
var chatstream;
var ptime2 = 0;
var wss = 0;

function pwssconnect(){
  try {
    var proom = jobrefnumber;
    wss = new WebSocket(host);
    wss.onmessage = (event) => {
      ptime = document.getElementById('ptime');
      ctime = event.data;
      var cl = ctime.length;
      if (cl < 15){
        ptime.innerHTML = 'Server Time: '+ctime;
        wsMessage(event);
      } else {
        wsMessage(event);
      }
    };
    wss.onclose = () => {
      var wscl = dbTime()+": "+pduration+",\n wsClosed."+alias;
      var pdata = {"data": wscl};
      //wss.send(JSON.stringify(pdata));
      wss.close();
      console.log(pdata);
      wsMessage(pdata);
    };
    wss.onopen = () => {
      var pdata = {
        "name": alias,
        "chatid": chatid,
        "chatid2": chatid2,
        "room": jobrefnumber,
        "subject": projectname,
        "data": ddate+": "+pduration
      };
      wss.send(JSON.stringify(pdata));
      console.log(dbTime(), pdata);
    };
    wss.onerror = (error) => {
      console.log(dbTime(), error);
    };
  } catch (e) {
    console.log('Server Time2: '+ptime2, e);
  } finally {
    console.log('Server Time3: '+ptime2+" "+"\n"+dbTime()+"\n"+jobrefnumber, ws);
  }
}

console.log("Guest: "+guestalias);
console.log("ChatAlias: "+chatalias);
console.log("Alias: "+alias);
console.log("Chattoken: "+chattoken);
console.log("Projectrefnumber: "+projectrefnumber);
console.log("Chatid: "+chatid);
console.log("Chatid2: "+chatid2);

function chat(a){
  try {
    var mediaoptions = {
      audio: true,
      video: true
    };
    navigator.mediaDevices.getUserMedia(mediaoptions)
    	.then(streamA => {
        chatstream = streamA;
        done = 1;
        if(a == 1){
          pcon(chatstream);
        }
    		document.getElementById("vchat1").srcObject = streamA;
    		  console.log("Video online.");
    	})
    	.catch(err => {
    		console.log('navigator.getUserMedia, 01: ', err);
    	});
  } catch (e) {
    console.log("ErrorCamera, 02: ", e)
  } finally {
    console.log("Done: ", done)
  }
}

function init(){
  try {
    peer.on('open', function(){
      console.log("Peer On Open: "+ctime, peer.id);
      document.getElementById('btnReconect').value = 'OpenLine';
    });
    //Data connection.
    conn1.on('open', function(){
      console.log("Chatapp Connected.", ctime);
      conn1.send('Hello there: '+ctime);
    });

    peer.on('connection', function(conn){
      console.log("Connected: "+pduration, ctime)
      document.getElementById('btnReconect').value = 'online';
      conn1.on('data', function(data){
        console.log(ctime, data);
        peerMessage(data);
      });
    });
    peer.on('disconnect', function(conn) {
      console.log("Disconnected: "+pduration, ctime);
      document.getElementById('btnReconect').value = 'offline';
    });
    peer.on('error', function(err){
        console.log("Error: "+ctime, err);
        document.getElementById('btnReconect').value = 'Retry';
    });
    //Media Call.
    peer.on('call', function(call) {
      console.log("Media On Call.", ctime);
      var inCall = confirm("Answer incoming call?");
      if(inCall){
        call.answer(chatstream);
    		call.on('stream', function(streamA) {
    			document.getElementById("vchat3").srcObject = streamA;
    			console.log("Answer Call connected.", ptime2);
    		});
        call.on('close', function(){
          console.log("Call done.", ptime2);
        });
      }
    });
  } catch (e) {
    console.log('Peer Server Time: '+ptime2, e)
  } finally {
    console.log('Peer Server Time: '+ptime2)
  }
}

function pcon(stream){
  try {
    document.getElementById("vchat4").srcObject = stream;
    peer = new Peer( chatid, {
      metadata: {'username': alias},
      host: phost,
      port: pport,
      path: ppath,
      debug: 3
    });
    conn1 = peer.connect(chatid2);
    init();
  } catch (e) {
    console.log('Peer Server Time: '+ptime2, e)
  } finally {
    console.log('Peer Server Time: '+ptime2)
  }
}

function pcall() {
  try {
    console.log("pcall: "+pduration, ptime2);
    var call = peer.call(chatid2, chatstream);
    call.on('stream', function(streamA) {
      document.getElementById("vchat2").srcObject = streamA;
      console.log("Call Media Connected.", ptime2)
    });
  } catch (e) {
    console.log('Peer Server Time: '+ptime2, e)
  } finally {
    console.log('Peer Server Time: '+ptime2)
  }
}

function pcallEnd() {
    console.log("pcallEnd: "+pduration, ptime2);
    if(conn1){
      conn1.close();
    }
}

function preconnect() {
    console.log("preconnect: "+pduration, ptime2);
    try {
      pcallEnd();
      peer.reconnect();
    } catch (e) {
      document.getElementById('btnReconect').value = "System: "+e;
    } finally {
      console.log(alias+" "+ptime2, pduration)
    }
}

function send(){
  console.log("send: "+pduration, ptime2);
}

function wsMessage(event){
  console.log("# "+dbTime(), event);
  var output = document.createElement("div");
  output.textContent = event.data;
  pinbox.appendChild(output);
}

function peerMessage(data){
  var message = '<b>From: '+data.from+'</b>';
  message += '<p>'+data.text+'</p>';
  message += '<p>'+data.time+'</p>';
  message += '<p>'+ptime2+'</p>';
  document.getElementById('message').innerHTML = message;
  document.getElementById('messages').innerHTML += message;
  try {
    conn1.send(data);
  } catch (e) {
    console.log("pSend : "+ptime2+" "+e, data);
  } finally {
    console.log("@pSend : "+ptime2);
  }
}

function initb(){
  /*
  document.getElementById('btnmess').addEventListener("click", function(){
    var mess = document.getElementById('txtm').value;
    var data = {
      from: alias,
      text: mess,
      time: ptime2
    };
    conn1.send(data);
    peerMessage(data);
    console.log("Send : "+ptime2, data);
    document.getElementById('txtm').value = ""
  });
  */
  document.getElementById('btnCall').addEventListener("click", function(){
    console.log("pcall: "+pduration+" ", ptime2);
    //pcall();
  });
  document.getElementById('btnEnd').addEventListener("click", function(){
    console.log("pcallEnd: "+pduration+" ", ptime2);
    //pcallEnd();
  });
}

function dbTime(){
  now = new Date();
  return now.getHours()+":"+now.getMinutes()+":"+now.getSeconds();
}

function psetup() {
  var sec1 = 1 * 1000;
  setInterval(() => {
    pduration -= 1;
    ptime2 = dbTime();
    document.getElementById('pduration').innerHTML = pduration;
    document.getElementById('ptime2').innerHTML = ptime2;
    if(pduration < 50){
      document.getElementById('btnDisConnect').click();
    }
  }, sec1);
  chat(1);
  initb();
  //pwssconnect();
  console.log("Done. "+pduration, ptime2);
}

//window.onload = () => {
//  psetup();
//};
