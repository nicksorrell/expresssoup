'use strict';

var express = require('express');
var app = express();

app.use(express.static('public'));

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
  client.select((process.env.NODE_ENV || 'development').length);
  console.log('Redis using db: ' + (process.env.NODE_ENV || 'development').length);
}
//END OF Redis Connection

app.get('/', function(req, res){
  res.send('Hello world!');
});

app.get('/cities', function(req, res){
  client.hkeys('cities', function(error, names){
    if(error) throw error;
    res.json(names);
  });
});

app.get('/cities/:name', function(req, res){
  client.hget('cities', req.params.name, function(error, desc){
    res.render('show.ejs',
      { city: { name: req.params.name, desc: desc}});
  });
});

app.post('/cities', urlencoded, function(req, res){
  var newCity = req.body;
  if(!newCity.name || !newCity.desc) {
    res.sendStatus(400);
    return false;
  }
  client.hset('cities', newCity.name, newCity.desc, function(error){
    if(error) throw error;
    res.status(201).json(newCity.name)
  });
});

app.delete('/cities/:name', function(req, res){
  client.hdel('cities', req.params.name, function(error){
    if(error) throw error;
    res.sendStatus(204);
  });
});

module.exports = app;
