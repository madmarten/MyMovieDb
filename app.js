const open = require('open');
const path = require('path');
var express = require('express');
var app = express();
app.get('/', function (req, res) {
  //res.send('Hello World!');
  res.sendFile(path.join(__dirname, '/index.html'));
});
app.listen(3080, function () {
  console.log('MyMovieDb istening on port 3080!');

  open('http://localhost:3080');
});