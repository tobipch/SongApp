//Dependencies
var db = require("../modules/dbConnect.js");

//Create SongStorage Main Object
var SongStorage = function(title, interpreter, releaseYear, cid){
    this.title = title;
    this.interpreter = interpreter;
    this.releaseYear = releaseYear;
    this.cid = cid;
};

//Create saveNewSong Function from SongStorage Object
SongStorage.prototype.saveNewSong = function(){
    var newSong = {
        songTitle: this.title,
        interpreter: this.interpreter,
        releaseYear: this.releaseYear,
        cid: this.cid
    };
    
    db.songCollection.save(newSong);
}

SongStorage.prototype.getAllSongs = function(callback){
    db.songCollection.find(function(err,items){
        callback(items);
    });
}

SongStorage.prototype.deleteSong = function(){
    console.log(this.cid);
    db.songCollection.remove({cid: this.cid},1);
}

module.exports = SongStorage;