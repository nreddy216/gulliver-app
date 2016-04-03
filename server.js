//require all dependencies
var express = require('express'),
    path = require('path'),
    cors = require('cors'),
    logger = require('morgan'),
    bodyParser = require('body-parser'),
    app = express();

var mongoose = require('mongoose');
//connect to DB
mongoose.connect('mongodb://localhost/travelogue');

//look this up? what does cors do?
app.use(cors());
app.use(logger('dev'));

//access body of any input by json object
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// set the static files location /public/img will be /img for users
app.use(express.static(__dirname + '/public'));

//require routes file
var routes = require('./config/routes');

//configute the routes
app.use('/', routes); //throws error?

//listen to port & startup the app
var port = process.env.PORT || 3000;
app.listen(port, function(){
  console.log("Listening to port ", port);
});

exports = module.exports = app;
