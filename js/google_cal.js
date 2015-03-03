//Create a new calendar
//1 calendar for all classes or each class has its own calendar?
gapi.client.calendar.calendars.insert(
{
    "resource" :
    {"summary": "McGill Schedule",
    "description": "Winter 2015",
    "timezone" : "Canada/Montreal"}
});

//Authenticate
var clientId = 'YOUR_CLIENT_ID';
var apiKey = 'YOUR_API_KEY';
var scopes = 'https://www.googleapis.com/auth/calendar';

//Insert recurring event
var resource = {
  "summary": "Appointment",
  "location": "Somewhere",
  "start": {
    "dateTime": "2011-12-16T10:00:00.000-07:00"//This is ISO 8601 Date time format
  },
  "end": {
    "dateTime": "2011-12-16T10:25:00.000-07:00"
  },
"recurrence": [
    "RRULE:FREQ=WEEKLY;UNTIL=20110701T170000Z",
  ],
};
var request = gapi.client.calendar.events.insert({
  'calendarId': 'primary', //Need to select the mcgill calendar
  'resource': resource
});
request.execute(function(resp) {
  console.log(resp);
});

//Check if user is logged in
function handleClientLoad() {
  gapi.client.setApiKey(apiKey);
  window.setTimeout(checkAuth,1);
  checkAuth();
}

function checkAuth() {
  gapi.auth.authorize({client_id: clientId, scope: scopes, immediate: true},
      handleAuthResult);
}

function handleAuthResult(authResult) {
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
  gapi.auth.authorize(
      {client_id: clientId, scope: scopes, immediate: false},
      handleAuthResult);
  return false;
}

//Log in button (HTML)
// <a href='#' id='authorize-button' onclick='handleAuthClick();'>Login</a>