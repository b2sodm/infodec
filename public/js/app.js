/////////////////////
// app.js
// Author: Brian
//////////////////////

var v = 0;
var wsize = window.innerWidth;
var hsize = window.innerHeight;
var x = document.getElementById('dvsize');
var output = document.createElement('div');
output.textContent = "w: "+wsize+", h: "+hsize;
x.appendChild(output);

function bsize () {
  v++;
  wsize = window.innerWidth;
  hsize = window.innerHeight;
  output.textContent = "#"+v+", w: "+wsize+", h: "+hsize;
  console.log("bsize #"+v+", w: "+wsize+", h: "+hsize);
}

if(window.addEventListener){
  window.addEventListener("resize", bsize);
  console.log("Resize #"+v+", w: "+wsize+", h: "+hsize);
} else if (window.attachEvent){
  window.attachEvent("onresize", bsize);
  console.log("onResize #"+v+", w: "+wsize+", h: "+hsize);
}

function smallScreen(){
  console.log("smallScreen #"+v+", w: "+wsize+", h: "+hsize);
  document.getElementById("dvbar1").classList.toggle("show");
}
