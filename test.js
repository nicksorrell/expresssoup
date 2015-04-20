var request = require('supertest');
var app = require ('./app');

var redis = require('redis');
var client = redis.createClient();
client.select('test'.length);
client.flushdb();

describe('Requests to the root path', function(){
  it('Returns a 200 status code', function(done){

    request(app)
      .get('/')
        .expect(200, done);
  });

  it('Returns an HTML format', function(done){
    request(app)
      .get('/')
        .expect('Content-Type', /html/, done);
  });

  it('Returns an index file with cities', function(done){
    request(app)
      .get('/')
        .expect(/cities/i, done);
  });
});

describe('Listing cities', function(){
  it('Returns 200 status code', function(done){
    request(app)
      .get('/cities')
        .expect(200, done);
  });

  it('Returns JSON format', function(done){
    request(app)
      .get('/cities')
        .expect('Content-Type', /json/, done)
  });

  it('Returns the initial list of cities', function(done){
    request(app)
      .get('/cities')
        .expect(JSON.stringify([]), done);
  });
});

describe('Creating new cities', function(){
  it('Returns a 201 status code', function(done){
    request(app)
      .post('/cities')
      .send('name=Springfield&desc=Where+the+simpsons+live')
        .expect(201, done);
  });

  it('Returns the city name', function(done){
    request(app)
      .post('/cities')
      .send('name=Springfield&desc=Where+the+simpsons+live')
        .expect(/springfield/i, done);
  });

  it('Returns a validation error if a field is blank', function(done){
    request(app)
      .post('/cities')
      .send('name=&desc=')
        .expect(400, done);
  });
});

describe('Deleting cities', function(){
  before(function(){
    client.hset('cities', 'Testcity', 'This is a test city');
  });

  after(function(){
    client.flushdb();
  });

  it('Returns a 204 status code', function(done){
    request(app)
      .delete('/cities/Testcity')
        .expect(204, done);
  });
});
