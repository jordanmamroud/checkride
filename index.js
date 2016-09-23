// note to self next thing to set up is to file storage on heroku for the ics files


var cors = require('cors');
var express = require('express');
var http = require('http');
var twilio = require('twilio');
var firebase = require("firebase");
var bodyParser = require('body-parser');
var fs = require('fs');
var path = require('path');
var firebase = require("firebase");
var icalToolKit = require("ical-toolkit");
var moment = require("moment");

var builder = icalToolKit.createIcsFileBuilder();
var client = new twilio.RestClient("ACcded30509c28e040d2f56f17680f8d85","58844f2471a9f7e07bc1804a6357f588");
var app = express();
var port = process.env.PORT || 5000 ;

app.set('port', (process.env.PORT || 5000));

firebase.initializeApp({
  serviceAccount: "firebaseservice.json",
  databaseURL: "https://checkride.firebaseio.com/"
});

var db = firebase.database();
var usersRef = db.ref("temp");
var calRef = db.ref("temp/calendars");

app.use(cors());
//app.options('*', cors());
app.get("/", function(req, res){
    console.log('hess');
    res.end('<h1>hey</h1>')
});

app.use(function(req, res, next){
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', "Content-Type, Accept");
    next();
});

app.post("/recurevents",function(req,res){
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', "Content-Type, Accept");
    req.on('data', function(data){
        var eventObj = JSON.parse(data);
        res.send("bane");    
        var start = moment(eventObj.start);
        var end = moment(eventObj.end);
        var eventKey = usersRef.push().key;
   
        createEvents();
        function createEvents(){
            for(var i =0 ; i <= eventObj.recurrences ;i++){
                  var key = usersRef.push().key;
                  var newObj ={
                      title: eventObj.title,
                      recur:eventObj.recur,
                      start:start.clone().add(i,eventObj.recur).toISOString(),
                      end: end.clone().add(i,eventObj.recur).toISOString(),
                      eventKey: eventKey 
                  }
                  if(eventObj.appointmentSlot ==true){
                      calRef.child(eventObj.userId+"/appointmentSlots").child(key).set(newObj);
                  }
                  calRef.child(eventObj.userId+"/events").child(key).set(newObj);
                  calRef.child(eventObj.userId+"/recurringEvents").child(eventKey).child(key).set(true);
            }
        }
    });
});

function getRecur(recur){
    switch(recur){
        case "daily": return 'days';
        case "weekly": return 'weeks' ;
        case "monthly": return 'month' ;
    }
}

app.post("/messages", function(req, res){
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
        res.setHeader('Access-Control-Allow-Headers', "Content-Type, Accept");
        req.on("data", function(data){
        console.log("data: " + data);
        var info = JSON.parse(data);
        console.log(info);
        res.send("bane");    
        
        
//    client.sms.messages.create({
//            to: info.phoneNumber,
//            from:'8482484339',
//            body:info.name
//        }, function(error, message) {
//            // The HTTP request to Twilio will run asynchronously. This callback
//            // function will be called when a response is received from Twilio
//            // The "error" variable will contain error information, if any.
//            // If the request was successful, this value will be "falsy"
//            if (!error) {
//                // The second argument to the callback will contain the information
//                // sent back by Twilio for the request. In this case, it is the
//                // information about the text messsage you just sent:
//                console.log('Success! The SID for this SMS message is:');
//                console.log(message.sid);
//
//                console.log('Message sent on:');
//                console.log(message.dateCreated);
//            } else {
//                console.log('Oops! There was an error.');
//            }
//        });  
    });
});

app.post("/work", function(req, res){
   res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', "Content-Type, Accept");
    req.on("data", function(data){
        console.log('handsy');
        console.log("data: " + data);
        var info = JSON.parse(data);
        res.send("bane");    
        icsFiles(req, usersRef, info);
        
    });  
});
        


var icsFiles = function(reqData, ref, info ){
    var dest = info.name + ".ics" ;
    usersRef.child("amyahoocom" + "/calendar/events").once("value", function(snap){
        snap.forEach(function(child){
                       builder.events.push({
                           start:new Date(child.val().start),
                           end: new Date(child.val().end),
                           transp: 'OPAQUE',
                           summary:child.val().title
                        });  
                    });
          fs.writeFile(dest, builder.toString(), function(err) {
              console.log('file supreme')
                        if (err) { console.log(err) };
                      });
        builder.events = [];
    });
    app.use("/calendars/" + info.name + ".ics", express.static(info.name + ".ics"));
}


//http.createServer(app).listen(port);
app.listen(app.get("port"), function() {
 console.log('Node app is running on port', app.get('port'));
});

//
//http.createServer(function(req, res){
//    res.writeHead(200, {'Content-Type':'text/plain'});
//    res.end('bane\n');
//    req.on("data", function(data){
//        console.log("data: " + data);
//        var info = JSON.parse(data);
//        console.log(info.phoneNumber);
//        
//    client.sms.messages.create({
//            to:info.phoneNumber,
//            from:'8482484339',
//            body:info.name
//        }, function(error, message) {
//            // The HTTP request to Twilio will run asynchronously. This callback
//            // function will be called when a response is received from Twilio
//            // The "error" variable will contain error information, if any.
//            // If the request was successful, this value will be "falsy"
//            if (!error) {
//                // The second argument to the callback will contain the information
//                // sent back by Twilio for the request. In this case, it is the
//                // information about the text messsage you just sent:
//                console.log('Success! The SID for this SMS message is:');
//                console.log(message.sid);
//
//                console.log('Message sent on:');
//                console.log(message.dateCreated);
//            } else {
//                console.log('Oops! There was an error.');
//            }
//        });
//        
//        
//    });
//}).listen(1337, '127.0.0.1');



//client.sms.messages.create({
//    to:'7328413268',
//    from:'8482484339',
//    body:'ahoy hoy! Testing Twilio and node.js'
//}, function(error, message) {
//    // The HTTP request to Twilio will run asynchronously. This callback
//    // function will be called when a response is received from Twilio
//    // The "error" variable will contain error information, if any.
//    // If the request was successful, this value will be "falsy"
//    if (!error) {
//        // The second argument to the callback will contain the information
//        // sent back by Twilio for the request. In this case, it is the
//        // information about the text messsage you just sent:
//        console.log('Success! The SID for this SMS message is:');
//        console.log(message.sid);
// 
//        console.log('Message sent on:');
//        console.log(message.dateCreated);
//    } else {
//        console.log('Oops! There was an error.');
//    }
//});

//
//var numbers = [];
//ref.on('child_added', function(snapshot) {
//numbers.push( snapshot.val());
//  console.log( 'Added number ' + snapshot.val() );
//});
//
//app.post('/message', function (req, res) {
//  var resp = new twilio.TwimlResponse();
//  if( req.body.Body.trim().toLowerCase() === 'subscribe' ) {
//    var fromNum = req.body.From;
//    if(numbers.indexOf(fromNum) !== -1) {
//      resp.message('You already subscribed!');
//    } else {
//      resp.message('Thank you, you are now subscribed. Reply "STOP" to stop receiving updates.');
//      ref.push(fromNum);
//    }
//  } else {
//    resp.message('Welcome to Daily Updates. Text "Subscribe" receive updates.');
//  }
//
//  res.writeHead(200, {
//    'Content-Type':'text/xml'
//  });
//  res.end(resp.toString());
//
//});
//
//console.log("helo");


//var express = require('express');
//var app = express();
//
//app.set('port', (process.env.PORT || 5000));
//
//app.use(express.static(__dirname + '/'));
//
//// views is directory for all template files
////app.set('views', __dirname + '/views');
////app.set('view engine', 'ejs');
//
//app.get('/', function(request, response) {
// response.render('index');
//});
//
//app.listen(app.get('port'), function() {
//  console.log('Node app is running on port', app.get('port'));
//});