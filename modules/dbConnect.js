//Settings
var dbURL = "127.0.0.1:27017/songDB";
var collections = ["songCollection"];

//Connect with mongojs-dependency
var db = require("mongojs").connect(dbURL, collections);

module.exports = db;