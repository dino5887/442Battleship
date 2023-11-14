//Fields from API

var gameState = 0;
//0 = game prep, place stuff
//1 = game started
//2 = game over
var turn;


var moverId = null;

var shipArray = new Array(10).fill().map(() => new Array(10).fill(""));
var shipCodeLength = {"CV":5, "BB":4, "CL":3, "SS":3, "DD":2};
var shipCodes = ["CV","BB","CL","SS","DD"];

function createBoard(){
    for ( let i = 0; i < 10; i++ ) {
        for ( let j = 0; j < 10; j++ ) {

            //Default the shipArray to noship, unexplored
            shipArray[i][j] = "NSS, X";

            // number of vh per square 5
            // distance in vh from edges of screen 50
            x = 5 * i + 20;
            y = 5 * j;
    
            //create grid letters
            if(i == 0){
                gridLetter = String.fromCharCode(j+65);
                var gridNum = document.createElementNS("http://www.w3.org/2000/svg", "text");
                gridNum.setAttribute("x", `${x-5}vh`);
                gridNum.setAttribute("y", `${y+4}vh`);
                gridNum.setAttribute("font-size", "4vh");
                gridNum.setAttribute("fill", "#231f20");
                gridNum.setAttribute("class", "gridNum");
                var textNode = document.createTextNode(gridLetter);
                gridNum.appendChild(textNode);
                boardZone.appendChild(gridNum);
            }

            //create grid numbers x2
            if(j == 9){
                var gridNum = document.createElementNS("http://www.w3.org/2000/svg", "text");
                gridNum.setAttribute("x", `${x}vh`);
                gridNum.setAttribute("y", `${y+10}vh`);
                gridNum.setAttribute("font-size", "4vh");
                gridNum.setAttribute("fill", "#231f20");
                gridNum.setAttribute("class", "gridNum");
                var textNode = document.createTextNode(i+1);
                gridNum.appendChild(textNode);
                boardZone.appendChild(gridNum);

                var gridNum = document.createElementNS("http://www.w3.org/2000/svg", "text");
                gridNum.setAttribute("x", `${x+55}vh`);
                gridNum.setAttribute("y", `${y+10}vh`);
                gridNum.setAttribute("font-size", "4vh");
                gridNum.setAttribute("fill", "#231f20");
                gridNum.setAttribute("class", "gridNum");
                var textNode = document.createTextNode(i+1);
                gridNum.appendChild(textNode);
                boardZone.appendChild(gridNum);
            }

            //create Ocean and Target Grid Squares
            var ocean = document.createElementNS("http://www.w3.org/2000/svg", "rect");
            ocean.setAttribute("x", `${x}vh`);
            ocean.setAttribute("y", `${y}vh`);
            ocean.setAttribute("width", "5vh");
            ocean.setAttribute("height", "5vh");
            ocean.setAttribute("stroke-width", "2");
            ocean.setAttribute("stroke", "#231f20");
            ocean.setAttribute("fill", "#39b8c9");
            ocean.setAttribute("id", `ocean_${i}${j}`);
            boardZone.appendChild(ocean);

            var target = document.createElementNS("http://www.w3.org/2000/svg", "rect");
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

    var gridNum = document.createElementNS("http://www.w3.org/2000/svg", "text");
    gridNum.setAttribute("x", `${30}vh`);
    gridNum.setAttribute("y", `${62}vh`);
    gridNum.setAttribute("font-size", "6vh");
    gridNum.setAttribute("fill", "#39b8c9");
    gridNum.setAttribute("class", "gridNum");
    var textNode = document.createTextNode("Ocean Grid");
    gridNum.appendChild(textNode);
    boardZone.appendChild(gridNum);

    var gridNum = document.createElementNS("http://www.w3.org/2000/svg", "text");
    gridNum.setAttribute("x", `${85}vh`);
    gridNum.setAttribute("y", `${62}vh`);
    gridNum.setAttribute("font-size", "6vh");
    gridNum.setAttribute("fill", "#32CD32");
    gridNum.setAttribute("class", "gridNum");
    var textNode = document.createTextNode("Target Grid");
    gridNum.appendChild(textNode);
    boardZone.appendChild(gridNum);

}

function createShips(){
    var CV = document.createElementNS("http://www.w3.org/2000/svg", "image");
    CV.setAttribute("href", "assets/SVG/CV2.svg");
    CV.setAttribute("x", "2vh");
    CV.setAttribute("y", "70vh");
    CV.setAttribute("width", "24.5vh");
    CV.setAttribute("height", "4.5vh");
    CV.setAttribute("id", "CV");
    CV.setAttribute("onmousedown", "setMove('CV');");
    boardZone.appendChild(CV);

    var BB = document.createElementNS("http://www.w3.org/2000/svg", "image");
    BB.setAttribute("href", "assets/SVG/BB2.svg");
    BB.setAttribute("x", "40vh");
    BB.setAttribute("y", "70vh");
    BB.setAttribute("width", "19.5vh");
    BB.setAttribute("height", "4.5vh");
    BB.setAttribute("id", "BB");
    BB.setAttribute("onmousedown", "setMove('BB');");
    boardZone.appendChild(BB);

    var CL = document.createElementNS("http://www.w3.org/2000/svg", "image");
    CL.setAttribute("href", "assets/SVG/CL2.svg");
    CL.setAttribute("x", "2vh");
    CL.setAttribute("y", "80vh");
    CL.setAttribute("width", "14.5vh");
    CL.setAttribute("height", "4.5vh");
    CL.setAttribute("id", "CL");
    CL.setAttribute("onmousedown", "setMove('CL');");
    boardZone.appendChild(CL);

    var SS = document.createElementNS("http://www.w3.org/2000/svg", "image");
    SS.setAttribute("href", "assets/SVG/SS2.svg");
    SS.setAttribute("x", "20vh");
    SS.setAttribute("y", "80vh");
    SS.setAttribute("width", "14.5vh");
    SS.setAttribute("height", "4.5vh");
    SS.setAttribute("id", "SS");
    SS.setAttribute("onmousedown", "setMove('SS');");
    boardZone.appendChild(SS);

    var DD = document.createElementNS("http://www.w3.org/2000/svg", "image");
    DD.setAttribute("href", "assets/SVG/DD2.svg");
    DD.setAttribute("x", "40vh");
    DD.setAttribute("y", "80vh");
    DD.setAttribute("width", "9.5vh");
    DD.setAttribute("height", "4.5vh");
    DD.setAttribute("id", "DD");
    DD.setAttribute("onmousedown", "setMove('DD');");
    boardZone.appendChild(DD);
}

function createControlPanel(){

    var controlPanel = document.getElementById("controlPanel");
    var gameState = document.createElement("h2");
    gameState.setAttribute("id", "gameState");
    var textNode = document.createTextNode("Placement Phase");
    gameState.appendChild(textNode);
    controlPanel.appendChild(gameState);
    
    var playerTurn = document.createElement("h2");
    playerTurn.setAttribute("id", "playerTurn");
    var textNode = document.createTextNode("Waiting for Blue & Red");
    playerTurn.appendChild(textNode);
    controlPanel.appendChild(playerTurn);
    
    var endTurnButton = document.createElement("button");
    endTurnButton.setAttribute("id", "endTurnButton");
    var textNode = document.createTextNode("End Turn");
    endTurnButton.appendChild(textNode);
    controlPanel.appendChild(endTurnButton);

    var bluePlayer = document.createElement("div");
    bluePlayer.setAttribute("id", "bluePlayer");
    var bluePlayerName = document.createElement("h3");
    bluePlayerName.setAttribute("id", "bluePlayerName");
    var textNode = document.createTextNode("Blue: Iowa");
    bluePlayerName.appendChild(textNode);
    bluePlayer.appendChild(bluePlayerName);
    controlPanel.appendChild(bluePlayer);

    var redPlayer = document.createElement("div");
    redPlayer.setAttribute("id", "redPlayer");
    var redPlayerName = document.createElement("h3");
    redPlayerName.setAttribute("id", "redPlayerName");
    var textNode = document.createTextNode("Red: Bismarck");
    redPlayerName.appendChild(textNode);
    redPlayer.appendChild(redPlayerName);
    controlPanel.appendChild(redPlayer);

    var errorPanel = document.createElement("div");
    errorPanel.setAttribute("id", "errorPanel");
    var errorText = document.createElement("h2");
    errorText.setAttribute("id", "errorText");
    var textNode = document.createTextNode("No Errors :)");
    errorText.appendChild(textNode);
    errorPanel.appendChild(errorText);
    controlPanel.appendChild(errorPanel);
}


if (gameState == 0) {
    //Create empty board for player to place ships on

var boardZone = document.getElementById("boardZone");


createBoard();

createShips();

init();

createControlPanel();

} else if (gameState == 1) {
    //Create active board from JSON data
    console.log("Game is active");
} else{
    //Create active board from JSON data
    console.log("Game is over");
}



function init(evt){
    document.getElementsByTagName( `svg` )[0].addEventListener( `mousemove`, moveMouse );
    document.getElementsByTagName( `svg` )[0].addEventListener( `mouseup`, releaseMouse );

    document.getElementsByTagName( `svg` )[0].addEventListener( `mousemove`, moveMouse );
    document.getElementsByTagName( `svg` )[0].addEventListener( `mouseup`, releaseMouse );
}

function setMove( id ) {
    moverId = id;
    myX = document.querySelector( `#${id}` ).getAttribute( `x` );
    myY = document.querySelector( `#${id}` ).getAttribute( `y` );
    const moverEle = document.getElementById( moverId );
    console.log( moverEle );
    // moverEle.addEventListener("keydown", event =>{
    //     console.log( evt );
    //     if (event.key === "r") {
            
    //         moverEle.setAttribute( `transform`, `rotate(90deg)`);
    //     }
    // }, true);
    console.log( myX, myY );
}

function moveMouse( evt ) {
    if ( moverId ) {

      const moverEle = document.getElementById( moverId );
    

      //console.log( evt );
      moverEle.setAttribute( `x`, evt.offsetX );
      moverEle.setAttribute( `y`, evt.offsetY );
    }
}

function rotateSelected(evt){
    
    if ( moverId ) {
    const moverEle = document.getElementById( moverId );

    
    }
}

function releaseMouse() {
    if ( moverId ) {
      const curX = parseInt( document.getElementById( moverId ).getAttribute( `x` ) ),
            curY = parseInt( document.getElementById( moverId ).getAttribute( `y` ) ),
            ship = document.getElementById( moverId )
            hit = checkHit( curX, curY);
            collision  = checkShipCollision(moverId);

            //length = shipCodeLength[moverId];
            //hit = checkHit( curX, curY, length);

      // if not on the checker board
      if ( !hit && !collision ) {
        const moverEle = document.getElementById( moverId );
        moverEle.setAttribute( `x`, myX );
        moverEle.setAttribute( `y`, myY );
      }

      moverId = undefined;
    }
}

function checkShipCollision(shipCode){
    placedShip = document.getElementById('CV').getBBox;
    shipCodes.forEach((drop) =>{
        if(drop != shipCode){
            drop = document.getElementById(drop).getBBox();
            console.log("Ship BBox: " + placedShip.toString());
            console.log("Drop BBox: " + drop.toString());

            if ( placedShip.x > drop.x && x < ( drop.x + drop.width )
            && y > drop.y && y < ( drop.y + drop.height ) ) {
                false;
            }
        }
    });
}

function checkHit( x, y) {

    for ( let tileX = 0; tileX < 10; tileX++ ) {
        for ( let tileY = 0; tileY < 10; tileY++ ) {
        const drop = document.getElementById( `ocean_${tileX}${tileY}` ).getBBox();
        
        console.log( drop );
        if ( x > drop.x && x < ( drop.x + drop.width )
            && y > drop.y && y < ( drop.y + drop.height ) ) {
        
                console.log(`ocean_${tileX}${tileY}`);
                //Check if ship colides with another ship
                // for ( let len = 0; len < length; len++ ) {
                //     if (shipArray[tileX+len][tileY] != "NSS, X"){
                //         document.getElementById(`errorText`).textContent = "Cannot Place Ships on Top of Each Other!";
                //         console.log(shipArray);
                //         //console.log("Cannot Place Ships on Top of Each Other!");
                //         return false;
                //     }
                // }

                //Add this ship to JSON
                //Needs to be moved to prevent repeat adds
                for ( let len = 0; len < length; len++ ) {
                    shipArray[tileX+len][tileY] = `${moverId}${len}, X`;
                }

                return true;
            }
        }
    }
    document.getElementById(`errorText`).textContent = "Cannot Place Ships Out of Bounds!";
    return false;
}
