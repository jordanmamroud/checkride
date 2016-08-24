
var ical = require('ics');
var fs = require('fs');
var path = require('path');
var firebase = require("firebase");
var express = require('express');
var icalToolKit = require("ical-toolkit");
var builder = icalToolKit.createIcsFileBuilder();
var bodyParser = require('body-parser');

var app = express();


firebase.initializeApp({
          databaseURL: "https://checkride.firebaseio.com",
          serviceAccount: "checkride-79b619f70d3f.json"
});

var db = firebase.database();
var usersRef = db.ref("users");

app.listen(4000);
app.use(express.static("./"));
app.use(bodyParser.json());
app.post("/info", function(req, res){

    icsFiles(req, usersRef);
    res.send("hello");
});

// auto-generate this config
var icsFiles = function(reqData,ref ){
    var dest = reqData.body.name + ".ics" ;
    usersRef.child(reqData.body.email +"/calendar/events").once("value", function(snap){
        snap.forEach(function(child){
                       builder.events.push({
                           start:new Date(child.val().start),
                           end: new Date(child.val().end),
                           transp: 'OPAQUE',
                           summary:child.val().title
                        });  
                    });
          fs.writeFile(dest, builder.toString(), function(err) {
                        if (err) { console.log(err) };
                      });
        builder.events = [];
    });
    app.use("/calendars/" + reqData.body.name + ".ics", express.static(reqData.body.name + ".ics"));
}

//ref.on("value", function(datasnapshot){
//    datasnapshot.forEach(function(childsnapshot){
//        if(childsnapshot.val().userData.userType.toLowerCase() == "examiner" ){
//            var examiner = childsnapshot.val().userData.emailAddress.replace(/[\*\^\.\'\!\@\$]/g, '');
//            var eventsRef = db.ref("users/" +examiner +"/calendar/events");
//            var dest = childsnapshot.val().userData.firstName + ".ics" ;
//            builder.calname = examiner.toString() + "cal";
//            eventsRef.on("value",function(snap){
//               snap.forEach(function(child){
//                   builder.events.push({
//                       start:new Date(child.val().start),
//                       end: new Date(child.val().end),
//                       transp: 'OPAQUE',
//                       summary:child.val().title
//                    });  
//                });;
//               });    
//                fs.writeFile(dest, builder.toString(), function(err) {
//                    if (err) { console.log(err) };
//                  });
//                
//            builder.events = [];
//            
//            app.use("/calendars/" + childsnapshot.val().userData.firstName + ".ics", express.static(childsnapshot.val().userData.firstName + ".ics"));
//            };
//        });
//    });
// app.use("/calendars/" + childsnapshot.val().userData.firstName + ".ics", express.static(childsnapshot.val().userData.firstName + ".ics"));

//app.use("/as.ics", express.static("./as.ics"));


//
//
//function createEvent(options, filepath, cb) {
//  var dest;
//  var options = options || {};
//  var cal = new CalEvent(options);
//  var data = cal.getEvent();
//
//    
//      
//    dest = 'gs://project-1750560572472647029.appspot.com/boom.ics'
//      
////  } else if (options.filename) {
////    dest = setFileExtension(path.join(TMPDIR, options.filename));
////  } else {
////    dest = path.join(TMPDIR, 'calendar-event.ics');
////  }
//
//  fs.writeFile(dest, data, function(err) {
//    if (err) { return cb(err) };
//    return cb(null, dest);
//  });
//}
//
//
//    
//    
//    
//    
//    
//  if (filepath) {
//    dest = path.join(filepath);
//  } else if (options.filename) {
//    dest = setFileExtension(path.join(TMPDIR, options.filename));
//  } else {
//    dest = path.join(TMPDIR, 'calendar-event.ics');
//  }
//
//  fs.writeFile(dest, data, function(err) {
//    if (err) { return cb(err) };
//    return cb(null, dest);
//  });


 



