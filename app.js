/*------------------------------------------API-------------------------------------------------*/

// Dependencies
var mongojs = require("mongojs");
var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var SongStorage = require('./modules/songStorage.js');

// load a configuration object --> set Settings
var generalConfig = {
  staticDirectories: ['/public'],
  port: 1337
};


// Create Express-App Variable
var app = express();
app.use(bodyParser());
app.use(cookieParser());


// Set Static Dirs static
generalConfig.staticDirectories.forEach(function(folder) {
  app.use(folder, express.static(__dirname + folder, { 'maxAge': 86400 })); // 1 day cache
});

// Add a route
app.post('/hello', function(request, response) {
  response.send({
    welcomeMessage: 'Hello ' + request.body.name
  });
});

// Add a song
app.post("/newSong", function(request, response){
    var songTitle = request.body.songTitle;
    var interpreter = request.body.interpreter;
    var releaseYear = request.body.releaseYear;
    var cid = request.body.cid;
    
    var storage = new SongStorage(songTitle, interpreter, releaseYear, cid);
    storage.saveNewSong();
});


app.post("/getSongs", function(request, response){
    var storage = new SongStorage();
    storage.getAllSongs(function(res){
        response.send(res);
    });
});

app.post("/deleteSong", function(request, response){
    var songTitle = request.body.songTitle;
    var interpreter = request.body.interpreter;
    var releaseYear = request.body.releaseYear;
    var cid = request.body.cid;
    
    var storage = new SongStorage(songTitle, interpreter, releaseYear, cid);
    storage.deleteSong();
});

// Send Client client.html
app.get('/', function(request, response) {
  response.sendfile(__dirname + '/public/html/client.html');
});

// Function for starting App
var startApp = function() {
  app.listen(generalConfig.port);
  console.log('App is listening on http://localhost:' + generalConfig.port + '\n');
};

startApp();