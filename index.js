var express = require('express');
const { PeerServer } = require('peer');
const { Server } = require('ws');
var pem = require('pem');
var http = require('http');
var https = require('https');
var bodyParser = require('body-parser');
var path = require('path');
var url = require('url');
var fs = require('fs');

var appport = 9000;
var httpsport = 9090;
var peerport = 9080;
var app = express();
var now;
var httpServer;
var httpsServer;
var dt = dbTime();
var pc = 0;
var users = [];

function chatid(){
  var rnd = Math.random().toString(36);
  var pstr = '0000000000000000000';
  var rndid = (rnd+pstr).substr(2, 16);
  return rndid;
}

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));
app.use(express.static(__dirname+'/public'));

function dbTime(){
  now = new Date();
  return now.getHours()+":"+now.getMinutes()+":"+now.getSeconds();
}

app.set('port', (process.env.PORT || appport));
app.get('/', function(req, res) {
  var pd = pc++;
  console.log("Index: "+ dbTime() +", chatd: "+ chatid() +", #: "+ pc++);
  res.render("pages/index", {chatsid: chatid(), pd: pd});
});

app.get('/download', function(req, res) {
  console.log("Download: "+ dbTime() +", download: "+ chatid() +", #: "+ pc++);
  res.download('assets/readme.txt');
});

app.get('/chatapp1', function(req, res) {
  //var data = req.body;
  var name = req.query.name;
  console.log("Chatapp1: "+dbTime()+", chatd: "+chatid()+", #: "+pc++);
  console.log("Req: "+req);
  console.log("Req: "+name);
  res.render('pages/chatapp1', {name: name+" "+pc++, chattoken: chatid(),
  chatsid: chatid()});
});

app.get('/chatapp2', function(req, res) {
  //var data = req.body;
  var name = req.query.name;
  var pd = pc++;
  console.log("Chatapp2: "+dbTime() +", chatd: "+chatid() +", #: "+pc++);
  console.log("Req: "+name);
  res.render('pages/chatapp2', {name: name+" "+pd, chattoken: chatid(),
  chatsid: chatid()});
});

app.post('/chatapp/onlinechat1', function(req, res) {
  var data = req.body;
  var pd = pc++;
  console.log("Chatapp1: "+ dbTime() +", chatd: "+ chatid() +", #: "+ pc++);
  console.log("Req: "+req+", "+data);
  console.log("Req: "+data.name+", "+data.chattoken);
  res.render('pages/chatapp1', {name: data.name+pd, chattoken: data.chattoken,
  chatsid: data.ref});
});

app.post('/chatapp/onlinechat2', function(req, res) {
  var data = req.body;
  var pd = pc++;
  console.log("Chatapp2: "+ dbTime() +", chatd: "+ chatid() +", #: "+ pc++);
  console.log("Req: "+req+", "+data);
  console.log("Req: "+data.name+", "+data.chattoken)
  res.render('pages/chatapp2', {name: data.name+pd, chattoken: data.chattoken,
  chatsid: data.ref});
});

app.post('/chatapp/messages', function(req, res) {
  var apptime = dbTime();
  var pd = pc++;
  console.log("Messages: "+ apptime +", chatd: "+ chatid() +", #: "+ pc++);
  res.render('pages/appindex', {chattime: apptime, pd: pd,
  chattoken1: chatid(), chattoken2: chatid()});
});

app.get('/exit', function(req, res) {
  var pd = pc++;
  console.log("Exit: "+ dbTime() +", chatd: "+ chatid() +", #: "+ pc++);
  res.render('pages/appindex', {chattime: dbTime(), pd: pd,
  chattoken1: chatid(), chattoken2: chatid()});
});

const pport = app.get('port');
const myServer = app.listen(pport, function() {
  console.log('App is now running at http://localhost:'+pport+'/');
  console.log('Hit CTRL-C to stop the server');
  console.log(now, " "+ dbTime() +" "+ chatid() +" "+ pc++);
});

try {
  //httpServer = http.createServer(app);
  //httpServer.listen(pport);
  //console.log('App1 is now running at http://localhost:'+pport+'/');
  //console.log('Hit CTRL-C to stop the server');
  //console.log(now, " "+ dbTime() +" "+ chatid() +" "+ pc++);
  const wss1 = new Server({
    server: myServer
  });
  wssConnect(wss1);
  console.log(dbTime(), "wss1 on: ws://localhost:"+pport);
} catch (e) {
  console.log(dbTime(), "wss1: "+e);
} finally {
  console.log(dbTime(), "@wss1: "+pc++);
}

try {
  var vhost = 'https://localhost';
  //var vhost = 'https://tbidschatapp.herokuapp.com';
  pem.createCertificate({days: 7, selfSigned: true}, function(err, keys) {
    var options = {
      key: keys.serviceKey,
      cert: keys.certificate
    };
    httpsServer = https.createServer(options, app);
    httpsServer.listen(httpsport);
    console.log('App2 is now running at: '+vhost+':'+httpsport+'/');
    const wss2 = new Server({
      server: httpsServer,
      origin: vhost
    });
    var pemcert = options.key+"\n"+options.cert;
    dt = dbTime();
    console.log("DT: "+dt+", "+now, pemcert);
    fs.writeFileSync('assets/pcert.pem', pemcert);
    wssConnect(wss2);
    console.log(dbTime(), "wss2 on: wss://localhost:"+httpsport);
  });
} catch (e) {
  dt = dbTime();
  console.log(now, "wss2: "+e);
} finally {
  dt = dbTime();
  console.log(now, "@wss2: "+pc++);
}

function wssConnect(wss){
  try {
    wss.on("connection", function connection(wssc, req) {
      //const ipc = req.connection.remoteAddress;
      const ip = req.socket.remoteAddress;
      dt = dbTime();
      console.log(now, 'wsConnected: \n'+ip);
      var cdata = {
	      from: ip,
	      text: req.url,
	      time: now
	    };
      users.push({ 'path': req.url, 'wssc': wssc });
      var jdata = JSON.stringify(cdata);
      pwsmessage(wss, wssc, jdata);
      var xuser = users.length;
      dt = dbTime();
      console.log(now, "#@wssc: "+xuser+", "+users[xuser-1].path);
      users[xuser-1].wssc.send(now+": #3450"+xuser);
      wssc.on('message', msg => {
        wsmessage(wss, wssc, msg);
        wssc.send(msg);
        dt = dbTime();
        console.log(now, ': '+msg+'\n'+ip)
      });
      wssc.on('close', () => {
        dt = dbTime();
        console.log(now, ': WebSocket closed.\n'+ip);
      });
      wssc.on('disconnect', () => {
        dt = dbTime();
        console.log(now, ': WebSocket disconnect.\n'+ip);
      });
    });

    wss.on('request', function(request) {
      var purl = request.url;
      dt = dbTime();
      console.log(now, 'wsConnected: \n'+purl+'\n'+request);
    });

    var sec30 = 30 * 1000;
    setInterval(() => {
      wss.clients.forEach((client) => {
        dt = dbTime();
        client.send(dt+" @ "+pc++);
      });
    }, sec30);
  } catch (e) {
    dt = dbTime();
    console.log(dt+", "+now, "wssc: "+e);
  } finally {
    dt = dbTime();
    console.log(dt+", "+now, "@wssc: "+users.length+", "+pc++);
  }
}

function wsmessage(wss, wssc, data){
  try {
    dt = dbTime();
    console.log(dt+", "+now, "wsmServer: "+wss+" "+wssc+" "+data);
    wss.clients.forEach((client) => {
      console.log(dbTime()+", "+now, "wsmServer: "+client+" "+pc++);
      client.send(data);
    });
  } catch (e) {
    dt = dbTime();
    console.log(dt+", "+now, "wsServer: "+e);
  } finally {
    dt = dbTime();
    console.log(dt+", "+now, "@wsServer: "+data);
  }
}

function pwsmessage(wss, wssc, data){
  try {
    dt = dbTime();
    console.log(dt+", "+now, "pwsmServer: "+wss+" "+wssc+" "+data);
    wss.clients.forEach((client) => {
      console.log(dbTime()+", "+now, "pwsmServer: "+client+" "+pc++);
      client.send(data);
    });
  } catch (e) {
    console.log(dbTime()+", "+now, "pwsServer: "+e);
  } finally {
    console.log(dbTime()+", "+now, "@pwsServer: "+data);
  }
}

try {
  peerport = (process.env.PORT || peerport);
  const peerServer = PeerServer({
    port: peerport,
    path: '/pchatapp',
    key: 'peerjs',
    debug: true
  });
  console.log("PeerServer: http://localhost:"+peerport+"/pchatapp");
} catch (e) {
  console.log("PSe: "+dbTime()+", "+now, "peerServer: "+e);
} finally {
  console.log("PSf: "+dbTime()+", "+now, "@peerServer: "+pc++);
}
