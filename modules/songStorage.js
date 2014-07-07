//Dependencies
var db = require("../modules/dbConnect.js");

//Create SongStorage Main Object
var SongStorage = function(title, interpreter, releaseYear){
    this.title = title;
    this.interpreter = interpreter;
    this.releaseYear = releaseYear;
};

//Create saveNewSong Function from SongStorage Object
SongStorage.prototype.saveNewSong = function(){
    var newSong = {
        songTitle: this.title,
        interpreter: this.interpreter,
        releaseYear: this.releaseYear
    };
    
    db.songCollection.save(newSong);
}

SongStorage.prototype.getAllSongs = function(callback){
    db.songCollection.find(function(err,items){
        callback(items);
    });
}

SongStorage.prototype.deleteSong = function(){
    db.songCollection.remove({songTitle: this.title, interpreter: this.interpreter, releaseYear: this.releaseYear},1);
}

module.exports = SongStorage;