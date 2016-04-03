//require all dependencies
var express = require('express'),
    path = require('path'),
    cors = require('cors'),
    logger = require('morgan'),
    bodyParser = require('body-parser'),
    app = express();

var mongoose = require('mongoose');
//connect to DB
mongoose.connect('mongodb://localhost:3000/travelogue');

//require routes file
var routes = require('./config/routes');

//look this up? what does cors do?
app.use(cors());
app.use(logger('dev'));

//access body of any input by json object
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(routes);

//listen to port
var port = 3000;
app.listen(port || 3000);
