const PIECE_PADDING = 0;
const PIECE_WIDTH = 100;
const WIDTH_AND_PADDING = PIECE_WIDTH + PIECE_PADDING;
const PIECES_PER_LINE = 8;

const BOARD_WIDTH = WIDTH_AND_PADDING * PIECES_PER_LINE;
const BOARD_HEIGHT = WIDTH_AND_PADDING * PIECES_PER_LINE;
const BOARD_MARGIN_TOP = 100;
const BOARD_MARGIN_LEFT = 100;
const BOARD_MARGIN_BOTTOM = 100;
const BOARD_MARGIN_RIGHT = 100;
const BOARD_COLOR = '#a996e4';

const ANIMATION_SPEED = 15;
const FADE_SPEED = 0.1;
const RARE_PIECE_ODDS = 40;

var frameNum = 0;
var tickCount = 0;
const tickSpeed = 2;

const PIECE_IMAGES = [
	document.getElementById("mookie"),
	document.getElementById("chicken"),
	document.getElementById("alpaca"),
	document.getElementById("toast"),
	document.getElementById("star"),
	document.getElementById("bomb")
];

const shineSprite = document.getElementById("shineSprite");

//http://editor.method.ac

var ctx, c, pieceLayout, cursorX, cursorY, extras = [];
var score = 0;

window.onload = function () {
	c = document.getElementById("myCanvas");

	c.width = BOARD_WIDTH + BOARD_MARGIN_LEFT + BOARD_MARGIN_RIGHT;
	c.height = BOARD_HEIGHT + BOARD_MARGIN_TOP + BOARD_MARGIN_BOTTOM;

	ctx = c.getContext("2d");

	c.onmousemove = function(e){
	    cursorX = e.pageX - BOARD_MARGIN_LEFT;
	    cursorY = e.pageY - BOARD_MARGIN_TOP;
	}

	c.onclick = function(){
		if(isMovingDone()){
			swapPieces();
		}
	}
	pieceLayout = generatePiecesArray();
	window.requestAnimationFrame(frame);
}

//runs every frame
function frame(){
	ctx.clearRect(0, 0, c.width, c.height);
	drawBoardArea();
		
	if(isMovingDone()){
		checkForBreaks();
	}

	if(isFadingDone()){
		breakPieces();
	}

	drawPieces();
	drawExtras();
	drawSelector();
	drawScore();
	hideStuffOffTheEdge();

	tickCount++;

	//count slowly
	if(tickCount > tickSpeed){
		tickCount == 0;
	}
	if(tickCount === tickSpeed){
		tickCount = 0;
		updateExtras();
	}
	window.requestAnimationFrame(frame);
}






