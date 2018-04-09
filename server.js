var express = require('express'),

app = express();
var http = require('http').Server(app);
 require('./routes/routes.js')(app);
 var db = require('./config/db');
 require('datejs');
var User = require('./models/User.js');
var logger = require('./config/lib/logger.js');
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;

//mongoose.createConnection(db.url);
mongoose.connect(db.url);

// Heroku assigns a port if port = process.env.PORT  
var port = process.env.PORT || 3300;
// set the view engine to ejs
app.set('view engine', 'ejs');
app.use(express.static('public'))
//app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
  res.send('WEb service is underconstruction');
});

http.listen(port, function(){
  console.log('listening on *:'+port);
});

