const express = require('express');
const path = require('path');

const app = express();

const router = express.Router();

router.use(express.urlencoded({extended: true}));

app.use(express.static(__dirname + "/public/"));

const urlencodeParser = express.urlencoded({extended: false});

express.static('public');


// default gateway
// app.get('/', function(req, res) {
//   res.sendFile(path.join(__dirname, '/public/Game.html'));
// });  


let server = app.listen(8081,function(){
  let host = server.address().address;
  let port = server.address().port;
  console.log("Example express app listening at http://%s:%s",host, port);
});