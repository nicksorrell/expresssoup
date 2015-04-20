'use strict';

var express = require('express');
var app = express();

var bodyParser = require('body-parser');
var urlencoded = bodyParser.urlencoded({ extended: false });

//Redis connection
var redis = require('redis');
if(process.env.REDISTOGO_URL){
  var rtg   = require("url").parse(process.env.REDISTOGO_URL);
  var client = redis.createClient(rtg.port, rtg.hostname);
  client.auth(rtg.auth.split(":")[1]);
} else {
  var client = redis.createClient();
}

client.select((process.env.NODE_ENV || 'development').length);
console.log('Redis using db: ' + (process.env.NODE_ENV || 'development').length);
//END OF Redis Connection

app.use(express.static('public'));

app.get('/', function(req, res){
  res.send('Hello world!');
});

app.get('/cities', function(req, res){
  client.hkeys('cities', function(error, names){
    if(error) throw error;
    res.json(names);
  });

});

app.post('/cities', urlencoded, function(req, res){
  var newCity = req.body;
  client.hset('cities', newCity.name, newCity.desc, function(error){
    if(error) throw error;
    res.status(201).json(newCity.name)
  });
});

module.exports = app;
