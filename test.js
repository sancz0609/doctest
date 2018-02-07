
var req = new XMLHttpRequest();
req.onload = function(event){
  alert("text file has opened");
}
req.open('get','./document.txt',true);
req.send();


// alert("hello world");
