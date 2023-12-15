const express = require('express');
const app = express();

const router = express.Router();


const jwt = require('jsonwebtoken');
const secret = `s/[BQ|x8(}-)ZY|Fkl-{)pvXrnGH`;

const PORT = 4000;

router.use(express.urlencoded({extended: true}));

app.use(express.static(__dirname + "/public/"));


express.static('public');


// default gateway
// app.get('/', function(req, res) {
//   res.sendFile(path.join(__dirname, '/public/Game.html'));
// });  


let server = app.listen(PORT,function(){
  let host = server.address().address;
  let port = server.address().port;
  console.log("Example express app listening at http://%s:%s",host, port);
});