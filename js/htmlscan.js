var reader=new FileReader();
var data;
var mcgill_classes=new Array();
var test="hey";
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
//Create a new calendar
//1 calendar for all classes or each class has its own calendar?
// gapi.client.calendar.calendars.insert(
// {
//     "resource" :
//     {"summary": "McGill Schedule",
//     "description": "Winter 2015",
//     "timezone" : "Canada/Montreal"}
// });

//Authenticate
var clientId = '613471085204-fvk3a7kfu7morl2gp97vspoj21r4b2fv.apps.googleusercontent.com';
//var apiKey = 'AIzaSyCZ8zC0LT8MDTkpDL41tlC7CB7AhOvH1Zw';
var scopes = 'https://www.googleapis.com/auth/calendar';

//Insert recurring event
// var resource = {
//   "summary": "Appointment",
//   "location": "Somewhere",
//   "start": {
//     "dateTime": "2011-12-16T10:00:00.000-07:00"//This is ISO 8601 Date time format
//   },
//   "end": {
//     "dateTime": "2011-12-16T10:25:00.000-07:00"
//   },
// "recurrence": [
//     "RRULE:FREQ=WEEKLY;UNTIL=20110701T170000Z",
//   ],
// };

//Check if user is logged in
// function handleClientLoad() {
//   alert("handle client load");
//   gapi.client.setApiKey(apiKey);
//   window.setTimeout(checkAuth,1);
// }

function checkAuth() {
  console.log("check auth");
  gapi.auth.authorize({client_id: clientId, scope: scopes, immediate: true},
      handleAuthResult);
}

function handleAuthResult(authResult) {
  console.log("handle auth result");
  var authorizeButton = document.getElementById('authorize-button');
  if (authResult) {
    //authorizeButton.style.visibility = 'hidden';
    makeApiCall();
  } else {
    authorizeButton.style.visibility = '';
    authorizeButton.onclick = handleAuthClick;
   }
}

function handleAuthClick(event) {
  console.log("handle auth click");
  gapi.auth.authorize(
      {client_id: clientId, scope: scopes, immediate: false},
      handleAuthResult);
  return false;
}

function makeApiCall() {
  console.log("make api call");
  gapi.client.load('calendar', 'v3', createCalendar);
}
function createCalendar(){
  console.log(test);
  console.log("Mcgill class 0"+mcgill_classes[0].class_name);
  var request=gapi.client.calendar.events.insert({
           "calendarId": "primary",
           resource:{
               "summary": "Appointment",
               "location": "Somewhere",
               "start": {
                 "dateTime": "2015-05-16T11:00:00.000-04:00"
               },
              "end": {
                 "dateTime": "2015-05-16T11:25:00.000-04:00"
               }
             }
         });
  request.execute(function(resp){console.log("executed")});
}


