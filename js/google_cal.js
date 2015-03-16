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
var clientId = '490744367652-8pquv32k0bj5alei6eh50ull50j74uek.apps.googleusercontent.com';
var apiKey = 'AIzaSyCZ8zC0LT8MDTkpDL41tlC7CB7AhOvH1Zw';
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
function handleClientLoad() {
  alert("handle client load");
  gapi.client.setApiKey(apiKey);
  window.setTimeout(checkAuth,1);
}

function checkAuth() {
  alert("checkauth");
  gapi.auth.authorize({client_id: clientId, scope: scopes, immediate: true},
      handleAuthResult);
}

function handleAuthResult(authResult) {
  alert("handle auth result");
  var authorizeButton = document.getElementById('authorize-button');
  if (authResult) {
    authorizeButton.style.visibility = 'hidden';
    makeApiCall();
  } else {
    authorizeButton.style.visibility = '';
    authorizeButton.onclick = handleAuthClick;
   }
}

function handleAuthClick(event) {
  alert("handle auth click");
  gapi.auth.authorize(
      {client_id: clientId, scope: scopes, immediate: false},
      handleAuthResult);
  return false;
}

function makeApiCall() {
  alert("apicall");
  gapi.client.load('plus', 'v1', function() {
    var request = gapi.client.plus.people.get({
      'userId': 'me'
    });
    request.execute(function(resp) {
      var heading = document.createElement('h4');
      var image = document.createElement('img');
      image.src = resp.image.url;
      heading.appendChild(image);
      heading.appendChild(document.createTextNode(resp.displayName));
      document.getElementById('content').appendChild(heading);
    });
  });
}

