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
  var mcgill_classes=new Array();
  
  for(var i=0;i<data_tables.length;i+=2){
    var mcgill_class=new Object();
    mcgill_class.class_name=data_tables[i].caption.textContent; 
    mcgill_class.times=data_tables[i+1].tBodies[0].rows[1].cells[0].textContent;
    mcgill_class.days=data_tables[i+1].tBodies[0].rows[1].cells[1].textContent;
    mcgill_class.classroom=data_tables[i+1].tBodies[0].rows[1].cells[2].textContent;
    mcgill_class.dates=data_tables[i+1].tBodies[0].rows[1].cells[3].textContent;
    mcgill_class.format=data_tables[i+1].tBodies[0].rows[1].cells[4].textContent;
    if(i==0){
      mcgill_classes[i]=mcgill_class;
    }
    else{
      mcgill_classes[i/2]=mcgill_class;
    }
  
  }
  for(var k=0;k<mcgill_classes.length;k++){
    for(var key in mcgill_classes[k]){
      console.log(mcgill_classes[k][key]);
    }
  }
  
}
window.onload=function(){
  var fileInput=document.getElementById("fileInput");
  fileInput.onchange=function handle(e){
    var file=fileInput.files[0];
    reader.readAsText(file);
  };
}  