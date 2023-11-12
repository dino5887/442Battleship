//Fields from API

var gameState = 0;
//0 = game prep, place stuff
//1 = game started
//2 = game over
var turn;


var moverId = null;



function createBoard(){
    for ( let i = 0; i < 10; i++ ) {
        for ( let j = 0; j < 10; j++ ) {
    
            // number of vh per square 7.5
            // distance in vh from edges of screen 50
            x = 7.5 * i + 50;
            y = 7.5 * j;
    
            color = `#39b8c9`;
            var target = document.createElementNS("http://www.w3.org/2000/svg", "rect");
            target.setAttribute("x", `${x}vh`);
            target.setAttribute("y", `${y}vh`);
            target.setAttribute("width", "7.5vh");
            target.setAttribute("height", "7.5vh");
            target.setAttribute("stroke-width", "2");
            target.setAttribute("stroke", "#231f20");
            target.setAttribute("fill", color);
            target.setAttribute("id", `target_${i}${j}`);
            boardZone.appendChild(target);
        }
    }
}

function createShips(){
    var CV = document.createElementNS("http://www.w3.org/2000/svg", "image");
    CV.setAttribute("href", "assets/SVG/CV2.svg");
    CV.setAttribute("x", "2vh");
    CV.setAttribute("y", "2vh");
    CV.setAttribute("width", "36.75vh");
    CV.setAttribute("height", "6.75vh");
    CV.setAttribute("id", "CV");
    CV.setAttribute("onmousedown", "setMove('CV');");
    boardZone.appendChild(CV);

    var BB = document.createElementNS("http://www.w3.org/2000/svg", "image");
    BB.setAttribute("href", "assets/SVG/BB2.svg");
    BB.setAttribute("x", "2vh");
    BB.setAttribute("y", "10vh");
    BB.setAttribute("width", "21.75vh");
    BB.setAttribute("height", "6.75vh");
    BB.setAttribute("id", "BB");
    BB.setAttribute("onmousedown", "setMove('BB');");
    boardZone.appendChild(BB);

    var CL = document.createElementNS("http://www.w3.org/2000/svg", "image");
    CL.setAttribute("href", "assets/SVG/CL2.svg");
    CL.setAttribute("x", "2vh");
    CL.setAttribute("y", "20vh");
    CL.setAttribute("width", "21.75vh");
    CL.setAttribute("height", "6.75vh");
    CL.setAttribute("id", "CL");
    CL.setAttribute("onmousedown", "setMove('CL');");
    boardZone.appendChild(CL);

    var SS = document.createElementNS("http://www.w3.org/2000/svg", "image");
    SS.setAttribute("href", "assets/SVG/SS2.svg");
    SS.setAttribute("x", "2vh");
    SS.setAttribute("y", "30vh");
    SS.setAttribute("width", "21.75vh");
    SS.setAttribute("height", "6.75vh");
    SS.setAttribute("id", "SS");
    SS.setAttribute("onmousedown", "setMove('SS');");
    boardZone.appendChild(SS);

    var DD = document.createElementNS("http://www.w3.org/2000/svg", "image");
    DD.setAttribute("href", "assets/SVG/DD2.svg");
    DD.setAttribute("x", "2vh");
    DD.setAttribute("y", "40vh");
    DD.setAttribute("width", "21.75vh");
    DD.setAttribute("height", "6.75vh");
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
}

function setMove( id ) {
    moverId = id;
    myX = document.querySelector( `#${id}` ).getAttribute( `x` );
    myY = document.querySelector( `#${id}` ).getAttribute( `y` );
    //console.log( myX, myY );
}

function moveMouse( evt ) {
    if ( moverId ) {

      const moverEle = document.getElementById( moverId );

      // move it!
      //console.log( evt );
      moverEle.setAttribute( `x`, evt.offsetX );
      moverEle.setAttribute( `y`, evt.offsetY );
    }
}

function releaseMouse() {
    if ( moverId ) {
      const curX = parseInt( document.getElementById( moverId ).getAttribute( `x` ) ),
            curY = parseInt( document.getElementById( moverId ).getAttribute( `y` ) ),
            hit = checkHit( curX, curY );

      // if not on the checker board
      if ( !hit ) {
        const moverEle = document.getElementById( moverId );
        moverEle.setAttribute( `x`, myX );
        moverEle.setAttribute( `y`, myY );
      }

      moverId = undefined;
    }
}

function checkHit( x, y ) {

    for ( let i = 0; i < 10; i++ ) {
        for ( let j = 0; j < 10; j++ ) {
        const drop = document.getElementById( `target_${i}${j}` ).getBBox();

        //console.log( drop );
        if ( x > drop.x && x < ( drop.x + drop.width )
            && y > drop.y && y < ( drop.y + drop.height ) ) {
        
                console.log(`target_${i}${j}`);

                return true;
            }
        }
    }
    document.getElementById( `errorText` ).textContent = "Cannot Place Ships Out of Bounds!";
    //console.log("Cannot Place Ships Out of Bounds!");
    return false;
}
