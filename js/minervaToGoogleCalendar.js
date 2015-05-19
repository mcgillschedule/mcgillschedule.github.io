var reader = new FileReader();
var data;
var mcgill_classes = new Array();

reader.onload = function() {
    data = reader.result;
    var dummy_element = document.createElement('div');
    dummy_element.innerHTML = data;
    //Now have div element with all data inside of it
    //convert data to ist of "Class objects"
    //Class objects should contain Class name, type (lecture, tutorial etc.), times, date range, location
    //Class name comes from caption text skipping the scheduled meeting times
    //All other data comes from the dddefault class, however will need to extract the correct data from there
    var data_tables = dummy_element.getElementsByClassName('datadisplaytable');
    
    console.log("TERM: " + data_tables[0].tBodies[0].rows[0].cells[0].textContent);
    for (var i = 0; i < data_tables.length; i += 2) {
        var mcgill_class = new Object();
        mcgill_class.class_name = data_tables[i].caption.textContent;
        mcgill_class.times = data_tables[i + 1].tBodies[0].rows[1].cells[0].textContent;
        mcgill_class.days = data_tables[i + 1].tBodies[0].rows[1].cells[1].textContent;
        mcgill_class.classroom = data_tables[i + 1].tBodies[0].rows[1].cells[2].textContent;
        mcgill_class.dates = data_tables[i + 1].tBodies[0].rows[1].cells[3].textContent;
        mcgill_class.format = data_tables[i + 1].tBodies[0].rows[1].cells[4].textContent;
        if (i == 0) {
            mcgill_classes[i] = mcgill_class;
        } 
        else {
            mcgill_classes[i / 2] = mcgill_class;
        }
    
    }
// for(var k=0;k<mcgill_classes.length;k++){
//   for(var key in mcgill_classes[k]){
//     console.log(mcgill_classes[k][key]);
//   }
// }

}
window.onload = function() {
    var fileInput = document.getElementById("fileInput");
    fileInput.onchange = function handle(e) {
        var file = fileInput.files[0];
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


function checkAuth() {
    console.log("check auth");
    gapi.auth.authorize({client_id: clientId,scope: scopes,immediate: true}, 
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
    {client_id: clientId,scope: scopes,immediate: false}, 
    handleAuthResult);
    return false;
}

function testCallback() {
    one(two);
}

function one(callback) {
    setTimeout(function() {
        alert("delay 1")
    }, 2000);
    callback();
}
function two() {
    setTimeout(function() {
        alert("delay 2")
    }, 1000);
}
function makeApiCall() {
    console.log("make api call");
    gapi.client.load('calendar', 'v3', add);
}
function add() {
    addCalendar(getCalendarID(addClasses));
}
function addCalendar(callback) {
    var req = gapi.client.calendar.calendars.insert(
    {
        "resource": 
        {"summary": "McGill Schedule",
            "description": "Winter 2015",
            "timezone": "Canada/Montreal"}
    });
    req.execute(function(resp) {
        console.log("added calendar");
        callback();
    });
}
function getCalendarID(callback) {
    var req = gapi.client.calendar.calendarList.list({});
    req.execute(function(resp) {
        for (var i = 0; i < resp.items.length; i++) {
            if (resp.items[i].summary === "McGill Schedule") {
                console.log("Mcgill Sched id: " + resp.items[i].id);
                calendarID = resp.items[i].id;
                callback();
                break;
            }
        }
    });
}
function addClasses() {
    for (var i = 0; i < 1; i++) {
        if (mcgill_classes[i].times === "TBA") {
            continue;
        } 
        else {
            var dashSplit = mcgill_classes[i].times.split("-");
            console.log("Class Name: " + mcgill_classes[i].class_name);
            console.log("Times: " + mcgill_classes[i].times);
            console.log(getTime(dashSplit[0]));
            console.log(getTime(dashSplit[1].substring(1, dashSplit[1].length + 1)));
            console.log("Start Time: " + getYear(mcgill_classes[i].dates) + "-" + lookupMonth(getFirstMonth(mcgill_classes[i].dates)) + "-" + getFirstDay(mcgill_classes[i].dates) + "T" + getTime(dashSplit[0]) + ":00.000");
            console.log("End Time: " + getYear(mcgill_classes[i].dates) + "-" + lookupMonth(getFirstMonth(mcgill_classes[i].dates)) + "-" + getFirstDay(mcgill_classes[i].dates) + "T" + getTime(dashSplit[1]) + ":00.000");
            console.log("Days: " + convertDays(mcgill_classes[i].days));
            console.log("End Recurrence: " + getYear(mcgill_classes[i].dates) + lookupMonth(getLastMonth(mcgill_classes[i].dates)) + getLastDay(mcgill_classes[i].dates));
            var request = gapi.client.calendar.events.insert({
                "calendarId": "primary",
                resource: {
                    "summary": mcgill_classes[i].class_name + " " + mcgill_classes[i].format,
                    "location": mcgill_classes[i].classroom,
                    "start": {
                        "dateTime": getYear(mcgill_classes[i].dates) + "-" + lookupMonth(getFirstMonth(mcgill_classes[i].dates)) + "-" + getFirstDay(mcgill_classes[i].dates) + "T" + getTime(dashSplit[0]) + ":00.000",
                        "timeZone": "America/Montreal"
                    },
                    "end": {
                        "dateTime": getYear(mcgill_classes[i].dates) + "-" + lookupMonth(getFirstMonth(mcgill_classes[i].dates)) + "-" + getFirstDay(mcgill_classes[i].dates) + "T" + getTime(dashSplit[1].substring(1, dashSplit[1].length + 1)) + ":00.000",
                        "timeZone": "America/Montreal"
                    },
                    "recurrence": ["RRULE:FREQ=WEEKLY;BYDAY=" + convertDays(mcgill_classes[i].days) + ";UNTIL=" + getYear(mcgill_classes[i].dates) + lookupMonth(getLastMonth(mcgill_classes[i].dates)) + getLastDay(mcgill_classes[i].dates) + "T220000Z"]
                }
            });
            request.execute(function(resp) {
                console.log("Added class " + mcgill_classes[i].class_name)
            });
        }
    }
}

function getYear(dates) {
    return dates.substring(dates.length - 4, dates.length);
}
function getFirstDay(dates) {
    return dates.slice(4, 6);
}
function getLastDay(dates) {
    return dates.slice(-8, -6);
}
function getFirstMonth(dates) {
    return dates.slice(0, 3);
}
function getLastMonth(dates) {
    return dates.slice(-12, -9);
}
function getTime(times) {
    
    var spaceSplit = times.split(" ");
    var colonSplit = times.split(":");
    if ((times.search("PM") != -1) && (Number(colonSplit[0]) < 12)) {
        return String(Number(colonSplit[0]) + 12) + ":" + colonSplit[1].substring(0, 2);
    }
    return spaceSplit[0];

}
function convertDays(days) {
    var chars = days.split("");
    var result = "";
    for (c in chars) {
        
        switch (chars[c]) {
            case "M":
                result += "MO,";
                break;
            case "T":
                result += "TU,";
                break;
            case "W":
                result += "WE,";
                break;
            case "R":
                result += "TH,";
                break;
            case "F":
                result += "FR,";
                break;
        }
    }
    return result.substring(0, result.length);
}
function lookupMonth(month) {
    switch (month) {
        case "Sep":
            return "09";
        case "Dec":
            return "12";
        case "Jan":
            return "01";
        case "Apr":
            return "04";
        default:
            console.log("Error month does not match");
    }
}


