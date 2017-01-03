var MongoClient = require('mongodb').MongoClient,
  ObjectId = require('mongodb').ObjectId,
  async = require('async'),
  assert = require('assert');

// Connection URL
var url = "mongodb://localhost:27017/photosharingapp";
//MONGODB_URI: mongodb://heroku_2690zm94:u4n1lda8rt2gcllne84hg25ve8@ds151078.mlab.com:51078/heroku_2690zm94

var _db;


exports.init_db = function (callback) {
  MongoClient.connect(url, function (err, db) {
    assert.equal(null, err);
    console.log("Connected to MongoDB server.");
    _db = db;

    // Got the connection, now get the recipes collection. It's easy.
    exports.recipes = _db.collection("recipes");
    exports.albums = _db.collection("albums");
    exports.photos = _db.collection("photos");
    callback(null);
  });
}

// Anybody can just grab this and start making queries on it if they want.
exports.recipes = null;
exports.albums = null;
exports.photos = null;
