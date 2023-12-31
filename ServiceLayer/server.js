import express from 'express';
import { BusinessLayer } from '../BusinessLayer/BusinessLayer.js';

import {createServer} from 'http';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import cookieParser from 'cookie-parser';
import {Server} from 'socket.io';
import {check } from 'express-validator';
//import ws, {WebSocketServer} from 'ws';


import jsonwebtoken from 'jsonwebtoken';



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
app.use(express.json());


//security middleware

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

function bParse(input){
  let output = JSON.stringify(input);
  output = JSON.parse(output);
  return output
}

app.get('/register', function(req, res) {
  const token = req.cookies.token;
  const options = {
    root: __dirname + '/../Views/'
  }

  //redirect to home page is user has a valid token

  res.sendFile('Register.html', options, function(err) {
    if (err) {
      console.log(err);
    }
  });
});  


app.post('/loginRequest',async function(req, res) {
  const {username, password} = req.body;
  try{
    let loginResult = await bLayer.login(username, password.toString());
    console.log(loginResult);

    //renewing token needs to be handled eventually
    const token = jsonwebtoken.sign({ username: loginResult.username, idPlayer: loginResult.idPlayer}, secret, { expiresIn: '6h' });
    
    res.cookie('token', token, { httpOnly: true });
    res.status(200).redirect('/home');


  } catch (error){
    res.status(401).send(error.message);
  }
});

app.post('/registerRequest', async function(req, res) {
  const {username, password} = req.body;
  try{
    let result = await bLayer.createPlayer(username, password.toString());
    res.status(200).redirect('/');
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
      res.status(403).redirect('/');
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
  res.status(200).render('Home.ejs', json);
});

app.post('/oldMessages', verifyToken, async function(req, res) {
  
  //find what game the user is in
  let userGame = await bLayer.getPlayer(req.tokenUsername)

  let last10Messages = await bLayer.getLast10Messages(userGame.inGame);
  res.status(200).json(last10Messages);
});

app.get('/game', verifyToken, async function(req, res) {
  const gameId = req.query.gameid;
  if(!gameId){
    res.status(400).send("Game ID is required");
  }
  console.log(gameId);
  let game = await bLayer.getGame(gameId);
  game = game[0];
  let enemyUser = null;
  let userColor = null;
  let enemyColor = null;
  if(game.idBlue != req.tokenidPlayer){
    enemyUser = await bLayer.getPlayerID(game.idBlue);
    userColor = "Red";
    enemyColor = "Blue";
  } else{
    enemyUser = await bLayer.getPlayerID(game.idRed);
    userColor = "Blue";
    enemyColor = "Red";
  }
  
  const json = {
    gameId: gameId,
    myUsername: req.tokenUsername,
    enemyUsername: enemyUser.username,  
    myidPlayer: req.tokenidPlayer,
    userColor: userColor,
    enemyColor: enemyColor,
    blueId: game.idBlue,
    redId: game.idRed,
    token: req.cookies.token,
    gameState: game.gameState,
    currentTurn: game.currentTurn
  }

  res.status(200).render('Game.ejs', json);
});

// app.post('/updateBoard', verifyToken, async function(req, res) {
//   const {playercolor, ocean, gameState, idGame} = req.body;
//   console.log(req.body);
//   if(!gameState || !idGame){
//     res.status(400).send("Game State and Game ID are required");
//   } else{
//   let result = await bLayer.updateGameState(idGame, gameState);
//   res.status(200).json({gameState: gameState});
//   }
// });


//testing code kinda
//would ideally be replaced by a full connect and disconnect system
app.post('/flushGame', verifyToken, async function(req, res) {
  let userId = req.tokenidPlayer;
  let result = await bLayer.updatePlayerInGame(userId, 1);
  res.status(200).redirect('/home');
});

io.on('connection', async (socket) => {

  socket.on('end turn', async (input) => {
    playerColor = input['playerColor'];
    ocean = input['ocean'];
    gameState = input['gameState'];
    idGame = input['idGame'];
    token = input['token'];
    const decoded = jsonwebtoken.verify(token, secret);
    if(!decoded){
      throw new Error("Invalid Token");
    }

    let tokenUsername = decoded.username;
    let tokenidPlayer = decoded.idPlayer;

    //update the game state
    await bLayer.updateGameState(idGame, gameState);
    //update the board
    await bLayer.updateBoard(idGame, playerColor, ocean);


    io.to(idGame).emit('end turn', {gameState: gameState, playerColor: playerColor, ocean: ocean, idGame: idGame});
  });


  socket.on('join room', async (input) => {
    input = bParse(input);
    let token = input['token'];
    //Find out who sent the message
    const decoded = jsonwebtoken.verify(token, secret);
    if(!decoded){
      throw new Error("Invalid Token");
    }

    let tokenUsername = decoded.username;
    let tokenidPlayer = decoded.idPlayer;

    //Is the player in a game?
    let player = await bLayer.getPlayer(tokenUsername);
    let curGame = player.inGame;
    console.log('a user connected from game ' + curGame);
    socket.join(curGame);
  });

  socket.on('leave room', async (input) => {
    input = bParse(input);
    let token = input['token'];
    const decoded = jsonwebtoken.verify(token, secret);
    if(!decoded){
      throw new Error("Invalid Token");
    }

    let tokenUsername = decoded.username;
    let tokenidPlayer = decoded.idPlayer;

    let result = await bLayer.updatePlayerInGame(tokenidPlayer, 0);

    console.log('a user disconnected from game ' + curGame);
    socket.leave(curGame);
  });


  socket.on('challenge', async (input) => {
    input = bParse(input);
    let token = input['token'];
    const decoded = jsonwebtoken.verify(token, secret);
    if(!decoded){
      io.to("challenge/" + reciever).emit('error message', "Invalid Token");
      //throw new Error("Invalid Token");
    }

    //issuer
    let tokenUsername = decoded.username;
    let tokenidPlayer = decoded.idPlayer;
    
    //reciever
    let reciever = input['username'];
    let player = null;
    //Is the player in a game?
    try{
      player = await bLayer.getPlayer(tokenUsername);
    } catch(error){
      io.to("challenge/" + reciever).emit('error message', "Player does not exist");
      //throw new Error("Player does not exist");
    }

    let playerGame = null;
    if(player.inGame != 1){
      io.to("challenge/" + reciever).emit('error message', "This Player is already in a game!");
      //throw new Error("This Player is already in a game!");
    }

    //is the enemy in a game?
    let enemyid = await bLayer.getPlayer(reciever);
    let enemyGame = null;
    if(enemyid.inGame != 1){
      io.to("challenge/" + reciever).emit('error message', "This Player is already in a game!");
      //throw new Error("This Player is already in a game!");
    }

    //issue the challenge
    socket.join("challenge/" + reciever);

    //Need to fix this so issuer can't see it, can't figure it out rn
    let issuer = [tokenUsername];


    io.to("challenge/" + reciever).emit('recieve challenge', issuer);
  });

  socket.on('accept challenge', async (input) => {
    input = bParse(input);
    let token = input['token'];
    const decoded = jsonwebtoken.verify(token, secret);
    if(!decoded){
      //throw new Error("Invalid Token");
      io.to("challenge/" + decoded.username).emit('error message', "Invalid Token");
    }
    let enemyName = input['enemyName'];
    
    //create new game
    //get enemy id
    let enemy = await bLayer.getPlayer(enemyName);
    let enemyid = enemy.idPlayer;
    let game = await bLayer.createGame(decoded.idPlayer, enemyid);
    console.log(game);

    //update player inGame
    await bLayer.updatePlayerInGame(decoded.idPlayer, game.insertId);
    await bLayer.updatePlayerInGame(enemyid, game.insertId);

    io.to("challenge/" + decoded.username).emit('challenge accepted', game.insertId);
  });

  //needs work
  socket.on('decline challenge', async (input) => {
    input = bParse(input);
    let token = input['token'];
    const decoded = jsonwebtoken.verify(token, secret);
    if(!decoded){
      io.to("challenge/" + decoded.username).emit('error message', "Invalid Token");
      //throw new Error("Invalid Token");
    }

    //have the other player leave your challenge room
    if(io.sockets.adapter.rooms.has("challenge/" + decoded.username)){

    io.to("challenge/" + decoded.username).emit('challenge declined', input['username']);
  }
  });

  socket.on('chat message', async (input) => {
    input = bParse(input);
    let token = input['token'];
    let msg = input['msg'];
    const decoded = jsonwebtoken.verify(token, secret);

    let tokenidPlayer = decoded.idPlayer;
    let tokenUsername = decoded.username;
    let player = await bLayer.getPlayer(tokenUsername);


    let curGame = null;
    if(player.inGame == null){
      curGame = 1;      
    } else{
      curGame = player.inGame;
    }
    if(!decoded){
      io.to(curGame).emit('error message', "Invalid Token");
      //throw new Error("Invalid Token");
    }
    check(msg).isLength({min: 1, max: 200}).trim().escape();
    

    //Create message in the database using the data
    bLayer.createMessage(tokenidPlayer, curGame, msg);

    let result = [tokenUsername, msg, Date.now().toString()];
    io.to(curGame).emit('chat message', result);
  });


});
server.listen(PORT,function(){
  console.log("Server running at port" + PORT);
});


