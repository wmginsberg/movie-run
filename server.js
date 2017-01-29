/*jslint smarttabs:true */
/**
 * @author eliath <http://eliasmartinezcohen.com/>
 * @package chatroom
 * @version 0.1
 *
 * @description This file serves the chatroom!
 */

/* 
   Server setup
   ========================================================================== */

//set up express
var express = require('express'),
	app = express();
//set up socket.io stuff
var http = require('http'),
	server = http.createServer(app);

var path = require('path');


//now add socket.io
// var io = require('socket.io').listen(server);
// io.set('log level', 1); //debug mode off

// //json, urlencoded, multipart middleware:
// app.use(express.bodyParser());

app.use(express.static('public')); //needed to serve static files.
// app.use(express.favicon(__dirname + '/pub/img/favicon.png')); //favicon
// app.engine('html', engines.hogan); //run .html files through Hogan
// app.set('views', __dirname + "/src"); //templating
var bodyParser = require('body-parser');

// Launch Express instance
app.use(express.static(__dirname + '/'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
}));

// Configure Firebase
var firebase = require('firebase');
var config = {
	apiKey: "AIzaSyCPQecb0L92A-go-lx5kyQmeEeLF9KIsXo",
	authDomain: "ginsberg-method.firebaseapp.com",
	databaseURL: "https://ginsberg-method.firebaseio.com",
	storageBucket: "ginsberg-method.appspot.com",
	messagingSenderId: "452567208034"
};
firebase.initializeApp(config);


/* 
   Packaged Queries
   ========================================================================== */
/* DB Creation */
var createRoomsTable = 'CREATE TABLE IF NOT EXISTS rooms (name TEXT PRIMARY KEY);';
var createMessagesTable = 'CREATE TABLE IF NOT EXISTS messages (id INTEGER PRIMARY KEY AUTOINCREMENT, room TEXT, nickname TEXT, body TEXT, time INTEGER);';

/* Find shit */
var getRoomByName = 'SELECT name FROM rooms WHERE name=$1;';
var getRecentRooms = "SELECT DISTINCT room FROM messages WHERE time >= strftime('%s', 'now') - 300;"; //300 seconds = 5 min
var getMessagesInRoom = 'SELECT * FROM messages WHERE room=$1;';

/* Insert shit */
var insertRoom = 'INSERT INTO rooms VALUES ($1);';
var insertMessage = 'INSERT INTO messages(room, nickname, body, time) VALUES($1, $2, $3, $4);';

/* 
   More Database setup
   ========================================================================== */
// var anyDB = require('any-db');
// var conn = anyDB.createConnection('sqlite3://chatroom.db');


/* 
   Request Handlers
   ========================================================================== */

app.get('/', function(req, resp) {
	resp.send('index.html');
});


var roomId = ""; 

app.get('/:roomName', function(req, resp) {
	console.log("reached URL");
	var data = {roomExists: false};	//response data to send (json) roomExists starts as false
	var exists = false;
	//check if the room exists
	firebase.database().ref('/runs/').once('value').then(function(data) {
	   resp.sendFile('index.html', {root: "."});
	   var obj = data.val();
	   for (var room in obj) {
	   		if (room == req.params.roomName) {
	   			console.log("room: " + room + "     roomId: " + req.params.roomName);
	   			console.log("dir " + __dirname);
	   			console.log("room.title_aa " + obj[room]);
	   			//resp.sendFile('my-view2.html', {root: "./src"});
	   		}
	   }

	});

});



// app.get('/:roomName', function(req, resp) {
// 	//var roomName = req.params.roomName;
// 	//first we check if room exists:
// 	resp.send("src/my-view1.html");
// 	// console.log("req \n --> " + req.params.values());
// 	// firebase.database().ref('/runs/').once('value').then(function(data) {
// 	//    var obj = data.val();
// 	//    roomExists = false;
// 	//    console.log(obj);
// 	//    for (var room in obj) {
// 	//    	console.log(room);
// 	//    		if (room == req.params.roomName) {
// 	//    			var location = '/runs/' + req.params.roomName;
// 	//    			roomExists = true;
// 	//    			app.send("src/my-view1.html");
// 	//    		}
// 	//    }
// 	// });
// });



/*
//listening to port 8080
//no longer using this! listen with server instead
app.listen(8080);
*/
server.listen(8081);
