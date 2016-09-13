var path = require('path');
var express = require('express');
var app = express();
var PORT = process.env.PORT || 8080

app.use('/js',express.static(path.join(__dirname, '/js')));
app.use('/css',express.static(path.join(__dirname, '/css')));
//app.use('/modules',express.static(path.join(__dirname, '/modules')));


app.get('/', function(request, response) {
  response.sendFile(__dirname + '/index.html')
});

app.listen(PORT, function(error) {
  if (error) {
    console.error(error);
  } else {
    console.info("==> ??  Listening on port %s. Visit http://localhost:%s/ in your browser.", PORT, PORT);
  }
});