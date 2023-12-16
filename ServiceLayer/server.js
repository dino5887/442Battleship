import express from 'express';
import { BusinessLayer } from '../BusinessLayer/BusinessLayer.js';

//routing / parsing
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import cookieParser from 'cookie-parser';

//security
import jsonwebtoken from 'jsonwebtoken';
import sanitize from 'sanitize';


let bLayer = new BusinessLayer();
const app = express();
const router = express.Router();

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
    const token = jsonwebtoken.sign({ username: loginResult.username}, secret, { expiresIn: '3h' });
    
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
      req.tokenUsername = decoded.userId;
      req.tokenUserRole = decoded.userRole;
      next();
  } catch(error){
      res.status(401).json({ error: 'Invalid token', errorDescription: 'Token is invalid' });
  }
};


app.get('/home', verifyToken, function(req, res) {
  const options = {
    root: __dirname + '/../Views/'
  }

  res.sendFile('Home.html', options, function(err) {
    if (err) {
      console.log(err);
    }
  });

});  


let server = app.listen(PORT,function(){
  let host = server.address().address;
  let port = server.address().port;
  console.log("Example express app listening at http://%s:%s",host, port);
});