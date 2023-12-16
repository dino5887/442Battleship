import express from 'express';
import { BusinessLayer } from '../BusinessLayer/BusinessLayer.js';

import {createServer} from 'http';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import cookieParser from 'cookie-parser';
import {Server} from 'socket.io';
//import ws, {WebSocketServer} from 'ws';


import jsonwebtoken from 'jsonwebtoken';
import sanitize from 'sanitize';


const app = express();
const router = express.Router();
const server = createServer(app);
const io = new Server(server);
let bLayer = new BusinessLayer();




const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const secret = `s/[BQ|x8(}-)ZY|Fkl-{)pvXrnGH`;

const PORT = 4000;

//parsing / routing middleware
app.set('view engine', 'ejs');
app.use(express.static(__dirname + "/public/"));
app.use('/public/',express.static('public'));
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());



//security middleware
app.use(sanitize.middleware);

app.get('/', function(req, res) {
  const token = req.cookies.token;
  const options = {
    root: __dirname + '/../Views/'
  }

  //redirect to home page is user has a valid token
  if(!token){
  res.sendFile('Login.html', options, function(err) {
    if (err) {
      console.log(err);
    }
  });
  }else if (jsonwebtoken.verify(token, secret) == true){
    res.status(200).redirect('/home');
  } else{
    res.status(401).send("Your Token is invalid");
  }
});  


app.post('/loginRequest',async function(req, res) {
  const {username, password} = req.body;
  try{
    let loginResult = await bLayer.login(username, password.toString());
    console.log(loginResult);
    const token = jsonwebtoken.sign({ username: loginResult.username, idPlayer: loginResult.idPlayer}, secret, { expiresIn: '3h' });
    
    res.cookie('token', token, { httpOnly: true });
    res.status(200).redirect('/home');


  } catch (error){
    res.status(401).send(error.message);
  }
});

app.get('/logout', (req, res) => {
  res.clearCookie('token');
  res.status(200).redirect('/');
});

// Middleware to verify token
function verifyToken(req, res, next) {
  console.log(req.cookies);
  const token  = req.cookies.token;

  if (!token) {
      return res.status(401).json({ error: 'No token provided', errorDescription: 'Token is required' });
  }
  try{
      const decoded = jsonwebtoken.verify(token, secret);

      //add userId to the request
      req.tokenUsername = decoded.username;
      req.tokenidPlayer = decoded.idPlayer;
      next();
  } catch(error){
      res.status(401).json({ error: 'Invalid token', errorDescription: 'Token is invalid' });
  }
};


app.get('/home', verifyToken, function(req, res) {
  const options = {
    root: __dirname + '/../Views/'
  }

  let last10Messages = bLayer.getLast10Messages(1);
  let json = null;
  try{
    json = {
      messages: last10Messages,
      token: req.cookies.token
    };
  } catch{
    json = {
      messages: "No Messages Yet"    
    };
  }
  console.log(json);
  res.status(200).render('Home.ejs', json);


});


io.on('connection', async (socket) => {

  socket.on('join room', (token) => {
    //Find out who sent the message
    const decoded = jsonwebtoken.verify(token, secret);
    if(!decoded){
      //This should make it impossible to inject sql here
      throw new Error("Invalid Token");
    }

    let tokenUsername = decoded.username;
    let tokenidPlayer = decoded.idPlayer;

    //Is the player in a game?
    let player = bLayer.getPlayer(tokenUsername);
    let curGame = null;
    if(player.inGame == null){
      curGame = 1;      
    } else{
      curGame = player.inGame;
    }
    console.log('a user connected from game ' + curGame);
    socket.join(curGame);
  });

  socket.on('chat message', (msg, token) => {
    const decoded = jsonwebtoken.verify(token, secret);
    if(!decoded){
      //This should make it impossible to inject sql here
      throw new Error("Invalid Token");
    }

    let tokenidPlayer = decoded.idPlayer;
    let tokenUsername = decoded.userId;

    let player = bLayer.getPlayer(tokenUsername);

    let curGame = null;
    if(player.inGame == null){
      curGame = 1;      
    } else{
      curGame = player.inGame;
    }

    console.log('message: ' + msg);

    msg = sanitize(msg);

    //Create message in the database using the data
    bLayer.createMessage(tokenidPlayer, Date.now(), curGame, msg);
    result = [tokenUsername, msg, Date.now()];

    io.to(curGame).emit('chat message', result);
  });


});



// io.on('connection', (socket) => {
//   console.log('a user connected');
//   socket.on('chat message', (msg, token) => {
//       console.log('message: ' + msg);

//       //Find out who sent the message
//       const decoded = jsonwebtoken.verify(token, secret);
//       if(!decoded){
//         //This should make it impossible to inject sql here
//         throw new Error("Invalid Token");
//       }

//       let tokenUsername = decoded.userId;

//       //Is the player in a game?
//       let player = bLayer.getPlayer(tokenUsername);
      
//       if(player.inGame == null){

//       } else{

//       }

//       //Create message in the database using the data


//       io.emit('chat message', result);
//   });
// });


server.listen(PORT,function(){
  console.log("Server running at port" + PORT);
});

// const wss = new WebSocketServer({ server });
// wss.on('connection', (client) => {
//     console.log(client);
//     console.log('Client connected !')
//     client.on('message', (msg) => {
//         console.log(`Message:${msg}`);
//         wss.clients.forEach((client) => {
//             client.send(msg);
//         });
//     });
// })