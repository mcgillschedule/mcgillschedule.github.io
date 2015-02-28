var reader=new FileReader();
var data;
reader.onload=function(){
  data=reader.result;
  var dummy_element=document.createElement('div');
  dummy_element.innerHTML=data;
  //Now have div element with all data inside of it
  //convert data to ist of "Class objects"
  //Class objects should contain Class name, type (lecture, tutorial etc.), times, date range, location
  //Class name comes from caption text skipping the scheduled meeting times
  //All other data comes from the dddefault class, however will need to extract the correct data from there
  var data_tables=dummy_element.getElementsByClassName('datadisplaytable');
  var mcgill_class=new Object();
  if(data_tables[0].childNodes[0].innerText=="Scheduled Meeting Times"){
    mcgill_class.times=data_tables[0].childNodes[1].childNodes[0].childNodes[0].innerText; //bug here cannot extract data from table
  }
  else{
    mcgill_class.class_name=data_tables[0].childNodes[0].innerText; //this works
  }
  alert(mcgill_class.class_name);
  alert(mcgill_class.times);

}
window.onload=function(){
  var fileInput=document.getElementById("fileInput");
  fileInput.onchange=function handle(e){
    var file=fileInput.files[0];
    reader.readAsText(file);
  };
}  