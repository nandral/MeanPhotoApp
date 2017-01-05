var express = require('express'),
  bodyParser = require('body-parser'),
  morgan = require('morgan');

// Requires multiparty for File uploads
var multiparty = require('connect-multiparty');
var multipartyMiddleware = multiparty();


var album_hdlr = require('./handlers/albums.js');
var helpers = require('./handlers/helpers.js');

var db = require("./data/db.js");
var async = require("async");

var _port = 9999;
var app = express();

app.use(morgan('dev'));
app.use(bodyParser.json());


app.use(express.static(__dirname + "/static"));


app.get('/v1/albums.json', album_hdlr.list_all);
app.put('/v1/albums.json', album_hdlr.create_album);
app.get('/v1/albums/:album_name.json', album_hdlr.album_by_name);
app.get('/v1/albums/:album_name/photos.json', album_hdlr.photos_for_album);
app.put('/v1/albums/:album_name/photos.json',
  multipartyMiddleware,
  album_hdlr.add_photo_to_album);


db.init_db(function (err) {
  if (err) {
    console.error("Error initialising DB, aborting: " + JSON.stringify(err, 0, 2));
    console.log("Error initialising DB, aborting: " + JSON.stringify(err, 0, 2));

    exit(-1);
  } else {
    app.set('port', (process.env.PORT || 5000));

    app.listen(app.get('port'), function () {
      console.log('Node app is running on port', app.get('port'));
    });
  }
});









/**
 * res, http_status, code, message
 * res, http_status, err obj
 * res, err obj
 */
function send_error_resp() {
  var res, http_status, code, message;
  if (arguments.length == 4) {
    res = arguments[0];
    http_status = arguments[1];
    code = arguments[2];
    message = arguments[3];
  } else if (arguments.length == 3) {
    res = arguments[0];
    http_status = arguments[1];
    code = arguments[2].error;
    message = arguments[2].message;
  } else if (arguments.length == 2) {
    res = arguments[0];
    http_status = _http_code_from_error(arguments[1].error);
    code = arguments[1].error;
    message = arguments[1].message;
  } else {
    console.error("send_error_resp: YOU'RE DOING IT WRONG");
    throw new Error("send_error_resp called wrong-est-ly");
  }

  res.setHeader('Content-Type', 'application/json');
  res.status(http_status).send(JSON.stringify({
    error: code,
    message: message
  }));
  res.end();
}

function send_success_resp(res, obj) {
  if (arguments.length != 2) {
    console.error("send_success_resp: YOU'RE DOING IT WRONG");
    throw new Error();
  }
  res.setHeader('Content-Type', 'application/json');
  res.status(200).send(JSON.stringify(obj));
  res.end();
}


function _http_code_from_error(error_code) {
  switch (error_code) {
    // add other messages here when they're not server problems.
    default: return 503;
  }
}
