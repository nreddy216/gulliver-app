// require express and other modules
var express = require('express'),
    router = express.Router(), //router ~
    app = express(),
    bodyParser = require('body-parser'),
    hbs = require('hbs'),
    mongoose = require('mongoose'),
    auth = require('./resources/auth');

// require and load dotenv
require('dotenv').load();

// configure bodyParser (for receiving form data)
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// serve static files from public folder
app.use(express.static(__dirname + '/public'));

// set view engine to hbs (handlebars)
app.set('view engine', 'hbs');


//connect to specified heroku port or localhost:3000
var port = process.env.PORT || 3000;

// connect to mongodb
var uri = process.env.MONGOLAB_URI || "mongodb://localhost/travelogue";
mongoose.connect(uri, function(err, db){
  if (err){
    console.log("err", err);
  }
});

//all local api routes
var routes = require('./config/routes');
app.use(routes);

//CATCH ALL ROUTE FOR USER-FACING ROUTES
app.get('*', function (req, res) {
  res.render('index');
});

/*
 * Listen on localhost:3000
 */
app.listen(port, function() {
  console.log('Find me on port ', port);
});
