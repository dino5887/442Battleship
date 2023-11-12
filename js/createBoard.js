//Fields from API

var gameState = 0;
//0 = game prep, place stuff
//1 = game started
//2 = game over
var turn;


var moverId = null;






if (gameState == 0) {
    //Create empty board for player to place ships on

var boardZone = document.getElementById("boardZone");


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





var CV = document.createElementNS("http://www.w3.org/2000/svg", "image");
CV.setAttribute("href", "assets/SVG/CV2.svg");
CV.setAttribute("x", ".75vh");
CV.setAttribute("y", ".75vh");
CV.setAttribute("width", "36.75vh");
CV.setAttribute("height", "6.75vh");
CV.setAttribute("id", "CV");
CV.setAttribute("onmousedown", "setMove( 'CV' );");
boardZone.appendChild(CV);


init();

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
}
