var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;
var fs = require('fs');
var afterLoad = require('after-load');
const bodyParser = require('body-parser');

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});
// index.js

app.use(bodyParser.urlencoded({ extended: true }));
app.get('/try',function(req,res){
  fs.readFile('url.txt', 'utf8', function (err,data) {
    if (err) {
      return console.log(err);
    }
    res.sendFile(__dirname + '/url.txt');
   
    console.log(data);
});
});
app.post('/urlload', (req, res) => {
    console.log('Got body:', req.body.hh);
    
    fs.writeFile('url.txt', req.body.hh, function (err) {
      if (err) throw err;
      console.log('Replaced!');     
      res.sendStatus(200);
    });
});

io.on('connection', function(socket){
  
afterLoad('http://zooming.azurewebsites.net/node/url.txt', function(html){
   console.log(html);
   io.emit('chat message', html);
        
});
    
        
    
  socket.on('chat message', function(msg){
    io.emit('chat message', msg);
  });
});

http.listen(port, function(){
  console.log('listening on *:' + port);
});
