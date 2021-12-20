const open = require('open');
const path = require('path');
var express = require('express');
var app = express();
app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, '/index.html'));
});
app.use('/assets',express.static(path.join(__dirname, 'assets')));
app.listen(3080, function () {
  console.log('MyMovieDb listening on port 3080!');

  open('http://localhost:3080');
});