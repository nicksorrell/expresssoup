'use strict';

var express = require('express');
var app = express();

var bodyParser = require('body-parser');
var urlencoded = bodyParser.urlencoded({ extended: false });

var cities = {
  'Lotopia': 'It is Lotopia',
  'Caspiana': 'It is Caspiana',
  'Indigo': 'Indigo dont care'
};

app.use(express.static('public'));

app.get('/', function(req, res){
  res.send('Hello world!');
});

app.get('/cities', function(req, res){
  res.json(Object.keys(cities));
});

app.post('/cities', urlencoded, function(req, res){
  var newCity = req.body;
  cities[newCity.name] = newCity.desc;
  res.status(201).json(newCity.name)
});

module.exports = app;
