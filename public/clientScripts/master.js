export{shipCodeLength, shipCodes};
import{createStartingBoard, logShips} from './createBoard.js';
//global fields
var shipCodeLength = {"CV":5, "BB":4, "CL":3, "SS":3, "DD":2};
var shipCodes = ["CV","BB","CL","SS","DD"];



console.log("master.js loaded");
const socket = io();
const form = document.getElementById("battleMessageForm");
const token = document.getElementById("token");
const msg = document.getElementById("msg");
const messages = document.getElementById("messages");
    
//gamestate function
var gameState = document.getElementById("gameState");
var gameId = document.getElementById("gameState").dataset.gameState;
var gameStateNum = document.getElementById("gameState").dataset.gameState;
console.log(gameStateNum, "gameStateNum", gameState, "gameState");
function setGameState(state){
switch(state){
    case "0":
        gameState.appendChild(document.createTextNode("Waiting for Both Players to Place Ships"));
        break;
    case "1":
        gameState.appendChild(document.createTextNode("Waiting for blue player to place ships"));
        break;
    case "2":
        gameState.appendChild(document.createTextNode("Waiting for red player to place ships"));
        break;
    case "3":
        gameState.appendChild(document.createTextNode("Battle State"));
        break;
    case "4":
        gameState.appendChild(document.createTextNode("Game Over"));
        break;
}}
setGameState(gameStateNum);
socket.emit("join room", {token: token.value});


switch(gameStateNum){
    case "0":
        createStartingBoard();
        break;
    case "1":
        console.log("Waiting for Blue!");
        break;
}

document.querySelector('#endTurnButton').addEventListener('click', endTurn);
export function endTurn(){
    if(gameStateNum == 0 || (gameStateNum == 1 && userColor == "Blue") || (gameStateNum == 2 && userColor == "Red")){
        let json = logShips();
        let tempGameState = null;
        if(gameStateNum == 0 && userColor == "Blue"){
            tempGameState = 2;
        } else if(gameStateNum == 0 && userColor == "Red"){
            tempGameState = 1;
        } else if(gameStateNum == 2 && userColor == "Red"){
            tempGameState = 3;
        } else if(gameStateNum == 1 && userColor == "Blue"){
            tempGameState = 3;
        }
        gameStateNum = tempGameState;


        // fetch('/updateBoard', {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json'
        //     },
        //     body:{
        //         playerColor: userColor,
        //         ocean: json,
        //         gameState: gameStateNum,
        //         idGame: gameId
        //     }
        // }).then(response => {
        //     if(response.ok){
        //         response.json().then(data => {
        //             gameState = data.gameState;
        //             setGameState();
        //         });
        //     }
        // });

        socket.emit('end turn', {playerColor: userColor, ocean: json, gameState: gameStateNum, idGame: gameId, token: token.value, myidPlayer: myidPlayer});

    }


    socket.on("end turn", function(result) {
        let playerColor = result[0];
        let ocean = result[1];
        let gameState = result[2];
        let idGame = result[3];
        console.log("end turn", result);
        if(playerColor != userColor){
            gameStateNum = gameState;
            setGameState(gameStateNum);
            console.log("gameStateNum", gameStateNum);
        } else {
            document.getElementById(`errorText`).textContent = "Not Your Turn!";
            console.log("not your turn");
        }

        

    });




    form.addEventListener("submit", function(e) {
        e.preventDefault();
        if (msg.value) {
            console.log("sending message " + msg.value + " " + token.value);
            socket.emit("chat message", {msg: msg.value, token: token.value});
            msg.value = "";
        }
    });

    function createMessage(username, content, time){
        const item = document.createElement('li');
        item.class = "message";
        let mainMsgContainer = document.createElement('div');
        mainMsgContainer.setAttribute("class", "mainMsgContainer");

        let mainMsgUsernameLink = document.createElement('p');
        mainMsgUsernameLink.setAttribute("class", "mainMsgUsernameLink");
        mainMsgUsernameLink.addEventListener("click", function(e) {
            console.log("clicked on ");
            socket.emit("join challenge room", {token: token.value});
            socket.emit("challenge", {token: token.value, username: username});
        });
        let mainMsgUsernameLinkText = document.createTextNode(username + ":");
        mainMsgUsernameLink.appendChild(mainMsgUsernameLinkText);
        
        let mainMsgContent = document.createElement('p');
        mainMsgContent.setAttribute("class", "mainMsgContent");
        let mainMsgContentText = document.createTextNode(content);
        mainMsgContent.appendChild(mainMsgContentText);

        let dateContainer = document.createElement('div');
        dateContainer.setAttribute("class", "dateContainer");
        let dateMsg = document.createElement('p');
        dateMsg.setAttribute("class", "dateMsg");
        let dateMsgText = document.createTextNode(time);
        dateMsg.appendChild(dateMsgText);
        dateContainer.appendChild(dateMsg);

        item.appendChild(mainMsgContainer);
        mainMsgContainer.appendChild(mainMsgUsernameLink);
        mainMsgContainer.appendChild(mainMsgContent);
        mainMsgContainer.appendChild(dateContainer);

        messages.appendChild(item);
        window.scrollTo(0, document.body.scrollHeight);
    }

    

    //send chat messages to others in room
    socket.on("chat message", function(result) {            
        let username = result[0];
        let content = result[1];
        let time = result[2];

        createMessage(username, content, time);
    });

}



