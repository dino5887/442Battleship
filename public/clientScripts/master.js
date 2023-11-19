export{shipCodeLength, shipCodes};
import{createStartingBoard} from './createBoard.js';
//global fields
var shipCodeLength = {"CV":5, "BB":4, "CL":3, "SS":3, "DD":2};
var shipCodes = ["CV","BB","CL","SS","DD"];


//Fields from API

var gameState = 0;
//0 = both placing ships
//1 = red placing ships
//2 = blue placing ships
//3 = game started
//4 = game over

var turn;
var player;

switch(gameState){
    case 0:
        createStartingBoard();
    case 1:
        console.log("Waiting for Blue!");
}





function finishBoard(){
    //Send board to API
    //Update gameState
    if(player == "red"){
        gameState = 1;
    } else{
        gameState = 2;
    }
}



