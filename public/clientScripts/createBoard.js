import { shipCodeLength,shipCodes } from "./master.js";
var shipArray = new Array(10).fill().map(() => new Array(10).fill(""));

let boardZone = document.getElementById("boardZone");

var moverId = null;
var myX = null;
var myY = null;


export function createStartingBoard(){
    createGrid();
    createShips();
    attachEvents();
    createControlPanel();
}

function createGrid(){
    for ( let i = 0; i < 10; i++ ) {
        for ( let j = 0; j < 10; j++ ) {

            //Default the shipArray to noship, unexplored
            shipArray[i][j] = "NSS, X";

            // number of vh per square 5
            // distance in vh from edges of screen 50
            let x = 5 * i + 20;
            let y = 5 * j;
    
            //create grid letters
            if(i == 0){
                let gridLetter = String.fromCharCode(j+65);
                let gridNum = document.createElementNS("http://www.w3.org/2000/svg", "text");
                gridNum.setAttribute("x", `${x-5}vh`);
                gridNum.setAttribute("y", `${y+4}vh`);
                gridNum.setAttribute("font-size", "4vh");
                gridNum.setAttribute("fill", "#231f20");
                gridNum.setAttribute("class", "gridNum");
                let textNode = document.createTextNode(gridLetter);
                gridNum.appendChild(textNode);
                boardZone.appendChild(gridNum);
            }

            //create grid numbers x2
            if(j == 9){
                let gridNum = document.createElementNS("http://www.w3.org/2000/svg", "text");
                gridNum.setAttribute("x", `${x}vh`);
                gridNum.setAttribute("y", `${y+10}vh`);
                gridNum.setAttribute("font-size", "4vh");
                gridNum.setAttribute("fill", "#231f20");
                gridNum.setAttribute("class", "gridNum");
                let textNode = document.createTextNode(i+1);
                gridNum.appendChild(textNode);
                boardZone.appendChild(gridNum);

                gridNum = document.createElementNS("http://www.w3.org/2000/svg", "text");
                gridNum.setAttribute("x", `${x+55}vh`);
                gridNum.setAttribute("y", `${y+10}vh`);
                gridNum.setAttribute("font-size", "4vh");
                gridNum.setAttribute("fill", "#231f20");
                gridNum.setAttribute("class", "gridNum");
                textNode = document.createTextNode(i+1);
                gridNum.appendChild(textNode);
                boardZone.appendChild(gridNum);
            }

            //create Ocean and Target Grid Squares
            let ocean = document.createElementNS("http://www.w3.org/2000/svg", "rect");
            ocean.setAttribute("x", `${x}vh`);
            ocean.setAttribute("y", `${y}vh`);
            ocean.setAttribute("width", "5vh");
            ocean.setAttribute("height", "5vh");
            ocean.setAttribute("stroke-width", "2");
            ocean.setAttribute("stroke", "#231f20");
            ocean.setAttribute("fill", "#39b8c9");
            ocean.setAttribute("id", `ocean_${i}${j}`);
            boardZone.appendChild(ocean);

            let target = document.createElementNS("http://www.w3.org/2000/svg", "rect");
            target.setAttribute("x", `${x+55}vh`);
            target.setAttribute("y", `${y}vh`);
            target.setAttribute("width", "5vh");
            target.setAttribute("height", "5vh");
            target.setAttribute("stroke-width", "2");
            target.setAttribute("stroke", "#231f20");
            target.setAttribute("fill", `#32CD32`);
            target.setAttribute("id", `target_${i}${j}`);
            boardZone.appendChild(target);
        }
    }

    let gridNum = document.createElementNS("http://www.w3.org/2000/svg", "text");
    gridNum.setAttribute("x", `${30}vh`);
    gridNum.setAttribute("y", `${62}vh`);
    gridNum.setAttribute("font-size", "6vh");
    gridNum.setAttribute("fill", "#39b8c9");
    gridNum.setAttribute("class", "gridNum");
    let textNode = document.createTextNode("Ocean Grid");
    gridNum.appendChild(textNode);
    boardZone.appendChild(gridNum);

    gridNum = document.createElementNS("http://www.w3.org/2000/svg", "text");
    gridNum.setAttribute("x", `${85}vh`);
    gridNum.setAttribute("y", `${62}vh`);
    gridNum.setAttribute("font-size", "6vh");
    gridNum.setAttribute("fill", "#32CD32");
    gridNum.setAttribute("class", "gridNum");
    textNode = document.createTextNode("Target Grid");
    gridNum.appendChild(textNode);
    boardZone.appendChild(gridNum);

}

function createShips(){
    let CV = document.createElementNS("http://www.w3.org/2000/svg", "image");
    CV.setAttribute("href", "assets/SVG/CV2.svg");
    CV.setAttribute("x", "2vh");
    CV.setAttribute("y", "70vh");
    CV.setAttribute("width", "24.5vh");
    CV.setAttribute("height", "4.5vh");
    CV.setAttribute("id", "CV");
    CV.setAttribute("class", "ship");
    CV.addEventListener("mousedown", function(evt){
        evt.preventDefault();
        setMove("CV");
    });
    boardZone.appendChild(CV);

    let BB = document.createElementNS("http://www.w3.org/2000/svg", "image");
    BB.setAttribute("href", "assets/SVG/BB2.svg");
    BB.setAttribute("x", "40vh");
    BB.setAttribute("y", "70vh");
    BB.setAttribute("width", "19.5vh");
    BB.setAttribute("height", "4.5vh");
    BB.setAttribute("id", "BB");
    BB.setAttribute("class", "ship");
    BB.addEventListener("mousedown", function(evt){
        evt.preventDefault();
        setMove("BB");
    });
    boardZone.appendChild(BB);

    let CL = document.createElementNS("http://www.w3.org/2000/svg", "image");
    CL.setAttribute("href", "assets/SVG/CL2.svg");
    CL.setAttribute("x", "2vh");
    CL.setAttribute("y", "80vh");
    CL.setAttribute("width", "14.5vh");
    CL.setAttribute("height", "4.5vh");
    CL.setAttribute("id", "CL");
    CL.setAttribute("class", "ship");
    CL.addEventListener("mousedown", function(evt){
        evt.preventDefault();
        setMove("CL");
    });
    boardZone.appendChild(CL);

    let SS = document.createElementNS("http://www.w3.org/2000/svg", "image");
    SS.setAttribute("href", "assets/SVG/SS2.svg");
    SS.setAttribute("x", "20vh");
    SS.setAttribute("y", "80vh");
    SS.setAttribute("width", "14.5vh");
    SS.setAttribute("height", "4.5vh");
    SS.setAttribute("id", "SS");
    SS.setAttribute("class", "ship");
    SS.addEventListener("mousedown", function(evt){
        evt.preventDefault();
        setMove("SS");
    });
    boardZone.appendChild(SS);

    let DD = document.createElementNS("http://www.w3.org/2000/svg", "image");
    DD.setAttribute("href", "assets/SVG/DD2.svg");
    DD.setAttribute("x", "40vh");
    DD.setAttribute("y", "80vh");
    DD.setAttribute("width", "9.5vh");
    DD.setAttribute("height", "4.5vh");
    DD.setAttribute("id", "DD");
    DD.setAttribute("class", "ship");
    DD.addEventListener("mousedown", function(evt){
        evt.preventDefault();
        setMove("DD");
    });
    boardZone.appendChild(DD);
}

function createControlPanel(){

    let controlPanel = document.getElementById("controlPanel");
    let gameState = document.createElement("h2");
    gameState.setAttribute("id", "gameState");
    let textNode = document.createTextNode("Placement Phase");
    gameState.appendChild(textNode);
    controlPanel.appendChild(gameState);
    
    let playerTurn = document.createElement("h2");
    playerTurn.setAttribute("id", "playerTurn");
    textNode = document.createTextNode("Waiting for Blue & Red");
    playerTurn.appendChild(textNode);
    controlPanel.appendChild(playerTurn);
    
    let endTurnButton = document.createElement("button");
    endTurnButton.setAttribute("id", "endTurnButton");
    textNode = document.createTextNode("End Turn");
    endTurnButton.appendChild(textNode);
    controlPanel.appendChild(endTurnButton);

    let bluePlayer = document.createElement("div");
    bluePlayer.setAttribute("id", "bluePlayer");
    let bluePlayerName = document.createElement("h3");
    bluePlayerName.setAttribute("id", "bluePlayerName");
    textNode = document.createTextNode("Blue: Iowa");
    bluePlayerName.appendChild(textNode);
    bluePlayer.appendChild(bluePlayerName);
    controlPanel.appendChild(bluePlayer);

    let redPlayer = document.createElement("div");
    redPlayer.setAttribute("id", "redPlayer");
    let redPlayerName = document.createElement("h3");
    redPlayerName.setAttribute("id", "redPlayerName");
    textNode = document.createTextNode("Red: Bismarck");
    redPlayerName.appendChild(textNode);
    redPlayer.appendChild(redPlayerName);
    controlPanel.appendChild(redPlayer);

    let errorPanel = document.createElement("div");
    errorPanel.setAttribute("id", "errorPanel");
    let errorText = document.createElement("h2");
    errorText.setAttribute("id", "errorText");
    textNode = document.createTextNode("No Errors :)");
    errorText.appendChild(textNode);
    errorPanel.appendChild(errorText);
    controlPanel.appendChild(errorPanel);
}

function attachEvents(evt){
    document.getElementsByTagName( `svg` )[0].addEventListener( `mousemove`, moveMouse );
    document.getElementsByTagName( `svg` )[0].addEventListener( `mouseup`, releaseMouse );

    document.getElementsByTagName( `svg` )[0].addEventListener( `mousemove`, moveMouse );
    document.getElementsByTagName( `svg` )[0].addEventListener( `mouseup`, releaseMouse );
}

//put global event listener, if statement for is mover ele 
document.addEventListener("keydown", event =>{
    if(moverId){
    console.log( event );
    if (event.key === "r") {
        const moverEle = document.getElementById( moverId );
        console.log("I'm rotating");
        console.log(moverEle.style.transform);
        moverEle.style.transform = 'rotate(90deg)';
        //moverEle.setAttribute( `transform`, `rotate(90deg)`);
    }
    }
});

function setMove( id ) {
    moverId = id;
    myX = document.querySelector( `#${id}` ).getAttribute( `x` );
    myY = document.querySelector( `#${id}` ).getAttribute( `y` );
    const moverEle = document.getElementById( moverId );
}

function moveMouse( evt ) {
    if ( moverId ) {

      const moverEle = document.getElementById( moverId );
    

      //console.log( evt );
      moverEle.setAttribute( `x`, evt.offsetX );
      moverEle.setAttribute( `y`, evt.offsetY );
    }
}


function releaseMouse() {
    if ( moverId ) {
        let onBoard = checkOnBoard();
        let noCollide  = checkShipCollision(moverId);
        if(!onBoard){
            document.getElementById(`errorText`).textContent = "Cannot Place Ships Out of Bounds!";
            const moverEle = document.getElementById( moverId );
            moverEle.setAttribute( `x`, myX );
            moverEle.setAttribute( `y`, myY );
        }
        else if(!noCollide){
            document.getElementById(`errorText`).textContent = "Cannot Place Ships on Top of Each Other!";
            const moverEle = document.getElementById( moverId );
            moverEle.setAttribute( `x`, myX );
            moverEle.setAttribute( `y`, myY );
        } else{
            document.getElementById(`errorText`).textContent = "No Errors :)";
        }
        moverId = undefined;
    }
}

function checkShipCollision(){
    let placedShip = document.getElementById(moverId).getBBox();
    for(let i = 0; i < shipCodes.length; i++){
        if(shipCodes[i] != moverId){
        let otherShip = shipCodes[i];
            otherShip = document.getElementById(otherShip).getBBox();
            if(!((placedShip.x + placedShip.width < otherShip.x 
            //Is placed ship far enough left to not be covering?
            || placedShip.x > otherShip.x + otherShip.width)
            //Is placed ship far enough right to not be covering?
            || (placedShip.y > otherShip.y + otherShip.height
            //Is placed ship far enough down to not be covering?
            || placedShip.y + placedShip.height < otherShip.y)
            //Is placed ship far enough up to not be covering?
            )){
                return false;
            }      
        };
    };
    return true;
}

function checkOnBoard() {
        //check if the ship is out of bounds

        let topLeftEdge = document.getElementById( `ocean_00` ).getBBox();
        let bottomRightEdge = document.getElementById( `ocean_99` ).getBBox();
        let ship = document.getElementById( moverId ).getBBox();
        //topLeft is the most top and left the ship can ever be
        //bottom right is the most bottom and right the ship can ever be

        //Check if the ship is further than these bounds
        if ( ship.x < topLeftEdge.x ||
            ship.y < topLeftEdge.y ||
            ship.x + ship.width > bottomRightEdge.x + bottomRightEdge.width ||
            ship.y + ship.height > bottomRightEdge.y + bottomRightEdge.height ) {
                return false;
            }
        // console.log(ship);
        // console.log(topLeftEdge );
        return true;

}

function logShips(){

    for(ship in shipArray){
        
        length = shipCodeLength[ship];

    }
}

export{createGrid}

