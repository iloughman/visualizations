var express = require('express');
var path = require('path')
var bodyParser = require('body-parser')

var nodePath = path.join(__dirname, '../node_modules');
var clientPath = path.join(__dirname, '../client')

var app = express();
var port = (process.env.PORT) || 8000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(nodePath));
app.use(express.static(clientPath));

app.listen(port, function(){
	console.log("Listening to the listener")
})

app.use('/', function(req, res, next){
	res.sendFile(path.join(__dirname, '/index.html'))
})