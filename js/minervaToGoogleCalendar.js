var reader = new FileReader();
var data;
var mcgill_classes = new Array(); 
var calendarID;
var term;

reader.onload = function() {
    data = reader.result;
    var dummy_element = document.createElement('div');
    dummy_element.innerHTML = data;
    var data_tables = dummy_element.getElementsByClassName('datadisplaytable');

    console.log("TERM: " + data_tables[0].tBodies[0].rows[0].cells[1].textContent);
    term=data_tables[0].tBodies[0].rows[0].cells[1].textContent;

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
    for(var k=0;k<mcgill_classes.length;k++){
      for(var key in mcgill_classes[k]){
        console.log(mcgill_classes[k][key]);
      }
    }

}
window.onload = function() {
    var fileInput = document.getElementById("htmlUpload");
    fileInput.onchange = function handle(e) {
        var file = fileInput.files[0];
        reader.readAsText(file);
    };
}

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

function makeApiCall() {
    console.log("make api call");
    gapi.client.load('calendar', 'v3', add);
}

function add() {
    addCalendar(function(){
        getCalendarID(addClasses);
    });
}

function addCalendar(callback) {
    var req = gapi.client.calendar.calendars.insert(
    {
        "resource": 
        {"summary": "McGill Schedule",
            "description": term,
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
                console.log("Mcgill Sched id: " + ""+resp.items[i].id);
                calendarID = ""+resp.items[i].id;
                callback();
                break;
            }
        }
    });
}

function addClasses() {
    //get start day of term 
    //determine day of week
    //if class does not occur on that day of the week, delete it from the first day
    var weekdays=["SU","M","T","W","R","F","SA"];
    for (var i = 0; i < mcgill_classes.length; i++) {
        var d=new Date(getYear(mcgill_classes[i].dates),lookupMonth(getFirstMonth(mcgill_classes[i].dates))-1,getFirstDay(mcgill_classes[i].dates));
        console.log(getYear(mcgill_classes[i].dates)+lookupMonth(getFirstMonth(mcgill_classes[i].dates))-1+getFirstDay(mcgill_classes[i].dates))
        console.log("Day of start: "+weekdays[d.getDay()]);
        if(mcgill_classes[i].days.indexOf(weekdays[d.getDay()]!=-1){
            console.log("Dont start on first day");
        }
        if (mcgill_classes[i].times === "TBA") {
            //Skip TBA classes i.e. unscheduled classes
            continue;
        } 
        else {
            //"3:35 PM - 5:25 PM" --> ["3:35 PM ", " 5:25 PM"]
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
                "calendarId": calendarID,
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
                    // ex: UNTIL="19960404T010000Z"
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
    //ex: "Sep 04, 2015 - Dec 07, 2015" --> 2015
    return dates.substring(dates.length - 4, dates.length);
}

function getFirstDay(dates) {
    //ex: "Sep 04, 2015 - Dec 07, 2015" --> 04
    return dates.slice(4, 6);
}

function getLastDay(dates) {
    //ex: "Sep 04, 2015 - Dec 07, 2015" --> 07
    return dates.slice(-8, -6);
}

function getFirstMonth(dates) {
    //ex: "Sep 04, 2015 - Dec 07, 2015" --> "Sep"
    return dates.slice(0, 3);
}

function getLastMonth(dates) {
    //ex: "Sep 04, 2015 - Dec 07, 2015" --> "Dec"
    return dates.slice(-12, -9);
}

function getTime(times) {
    //ex: "3:35 PM" --> "15:35"
    var spaceSplit = times.split(" ");
    var colonSplit = times.split(":");
    if ((times.search("PM") != -1) && (Number(colonSplit[0]) < 12)) {
        return String(Number(colonSplit[0]) + 12) + ":" + colonSplit[1].substring(0, 2);
    }
    return spaceSplit[0];

}

function convertDays(days) {
    //ex: "MTW" --> "MO, TU, WE" (required format for google calendar api)
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


