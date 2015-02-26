var reader=new FileReader();
var data;
reader.onload=function(){
  data=reader.result;
  var el=document.createElement('div');
  el.innerHTML=data;
  alert(el.getElementsByClassName('staticheaders')[0].innerText);
}
window.onload=function(){
  var fileInput=document.getElementById("fileInput");
  fileInput.onchange=function handle(e){
    var file=fileInput.files[0];
    reader.readAsText(file);
  };
}  