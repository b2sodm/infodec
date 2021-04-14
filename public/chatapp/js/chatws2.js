///////////////////////////////
// chatws2.js
// Author: Brian M
///////////////////////////////

//alert("@wss"+wdbTime());
console.log("@wss1: ", wdbTime());
var wphost = "localhost";
var wpport = 9099;
var wwsport = 9090;
var wwssport = 9091;
var wppath = '/pchatapp';
var wpath = 'ws://'+wphost+':'+wwsport;
var wpathX = 'wss://'+wphost+':'+wwssport;
//alert("@wss"+wdbTime());
//console.log("@wss: ", wdbTime());
var walias = document.getElementById('alias').value;
var wchatalias = document.getElementById('chatalias').value;
var wguestalias = document.getElementById('guestalias').value;
var wchattoken = document.getElementById('chattoken').value;
var wprojectrefnumber = document.getElementById('projectrefnumber').value;
var wprojectname = document.getElementById('subject').value;
var wjobrefnumber = document.getElementById('jobrefnumber').value;
var wptime = document.getElementById('ptime');
//var wpduration = document.getElementById('chatduration').value;
var wchatdate = document.getElementById('chatdate').value;
var wddate = document.getElementById('ddate').value;
var wpinbox = document.getElementById('pinbox');
wptime.innerHTML = 'Server Time: ';
var wctime = 0;
//wpduration += 60;
//alert("@wss"+wdbTime());
//console.log("@wss: ", wdbTime());
var wchatid = wchattoken;
var wchatid2 = wprojectrefnumber;
if (walias == wchatalias) {
    wchatid = wprojectrefnumber;
    wchatid2 = wchattoken;
}
var wpeer;
var wconn1;
var wdone = 0;
var wchatstream;
var wptime2 = 0;
var wwss = 0;
//alert("@wss"+wdbTime());
console.log("@wss2: ", wdbTime());
function wssconnect(){
  try {
    var proom = wjobrefnumber;
    var wspath = wpath+'/'+wjobrefnumber+'/'+alias;
    wss = new WebSocket(host);
    wss.onmessage = (event) => {
      wptime = document.getElementById('ptime');
      wctime = event.data;
      var cl = wctime.length;
      if (cl < 15){
        wptime.innerHTML = 'Server Time: '+wctime;
        wsMessage(event);
      } else {
        wwsMessage(event);
      }
    };
    wss.onclose = () => {
      var wscl = wdbTime()+": "+pduration+",\n wsClosed."+walias;
      var pdata = {"data": wscl};
      wss.send(JSON.stringify(pdata));
      wss.close();
      console.log(pdata);
      wsMessage(pdata);
    };
    wss.onopen = () => {
      var pdata = {
        "name": walias,
        "chatid": wchatid,
        "chatid2": wchatid2,
        "room": wjobrefnumber,
        "subject": wprojectname,
        "data": wddate+": "+pduration
      };
      wss.send(JSON.stringify(pdata));
      console.log(dbTime(), pdata);
    };
    wss.onerror = (error) => {
      console.log(wdbTime(), error);
    };
    document.getElementById('btnmess').addEventListener("click", function(){
	    var mess = document.getElementById('txtm').value;
	    var data = {
	      from: alias,
	      text: mess,
	      time: ptime2
	    };
	    wss.send(JSON.stringify(data));
	    peerMessage(data);
	    console.log("wsSend : "+ptime2, data);
	    document.getElementById('txtm').value = ""
	  });
  } catch (e) {
    console.log('Server Time2: '+wptime2, e);
  } finally {
    console.log('Server Time3: '+wptime2+" "+"\n"+wdbTime()+"\n"+wjobrefnumber, wss);
  }
}
//alert("@wss"+wdbTime());
console.log("@wss3: ", wdbTime());
try {
  console.log("Guest: "+guestalias);
	console.log("ChatAlias: "+chatalias);
	console.log("Alias: "+alias);
	console.log("Chattoken: "+chattoken);
	console.log("Projectrefnumber: "+projectrefnumber);
	console.log("Chatid: "+chatid);
	console.log("Chatid2: "+chatid2);
  console.log("Pduration: "+pduration);
} catch (e) {
	console.log("wws: "+wdbTime(), e);
} finally {
	console.log("@wws: "+wdbTime());
}
//alert("@wss"+wdbTime());
console.log("@wss4: ", wdbTime());
function wwsMessage(event){
  console.log("# "+wdbTime(), event);
  var output = document.createElement("div");
  output.textContent = event.data;
  pinbox.appendChild(output);
}

function wdbTime(){
  now = new Date();
  return now.getHours()+":"+now.getMinutes()+":"+now.getSeconds();
}

window.onload = () => {
  try {
  	psetup();
    wssconnect();
  } catch (e) {
    console.log("@wss6: ", wdbTime());
  } finally {
  	console.log("@wss7: ", wdbTime());
  }
};
//alert("@wss"+wdbTime());
console.log("@wss8: ", wdbTime());
