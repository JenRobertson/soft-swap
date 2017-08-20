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


function generatePiecesArray(){
	var pieceLayout = new Array(PIECES_PER_LINE);//columns

	for (column = 0; column < PIECES_PER_LINE; column++) {
		pieceLayout[column] = new Array(PIECES_PER_LINE);

		for (row = 0; row < PIECES_PER_LINE; row++) {
			pieceLayout[column][row] = getPiece(column, row);

			while (shouldBreak(pieceLayout, column, row)){
				pieceLayout[column][row] = getPiece(column, row);
			}
		}
	}
	return pieceLayout;
}

function swapPieces(){
	var column = Math.round(cursorX/WIDTH_AND_PADDING)-1;
	var row = Math.round(cursorY/WIDTH_AND_PADDING)-1;

	var bottomPiece = pieceLayout[column][row+1];
	var topPiece = pieceLayout[column][row];

	if(bottomPiece && topPiece){

		if (bottomPiece.effect){
			bottomPiece.effect(column, row+1);
		}
		else if (topPiece.effect){
			topPiece.effect(column, row+1);
		}
		else {
			pieceLayout[column][row]= bottomPiece;
			pieceLayout[column][row + 1]= topPiece;
			movePieces();
		}
	}
}

function checkForBreaks(){
	var breaks = 0;
	for (column = 0; column < PIECES_PER_LINE; column++) {
		for (row = 0; row < PIECES_PER_LINE; row++) {
			if(shouldBreak(pieceLayout, column, row) && !pieceLayout[column][row].broken){
				pieceLayout[column][row].broken = true;
				pieceLayout[column][row].newA = 0;
				breaks++;
			}
		}
	}
	if(breaks == 3){
		score+=1;
	}
	else if(breaks == 4){
		score+=2;
	}
	else if(breaks == 5){
		score+=4;
	}
	else if(breaks == 6){
		score+=8;
	}
	else if(breaks > 6){
		score+=20;
	}
}

function isMovingDone(){
	for (column = 0; column < PIECES_PER_LINE; column++) {
		for (row = 0; row < PIECES_PER_LINE; row++) {
			if(pieceLayout[column][row].y != pieceLayout[column][row].newY ){
				return false;
			}
		}
	}
	return true;
}

function isFadingDone(){
	for (column = 0; column < PIECES_PER_LINE; column++) {
		for (row = 0; row < PIECES_PER_LINE; row++) {
			if(pieceLayout[column][row].a != pieceLayout[column][row].newA ){
				return false;
			}
		}
	}
	return true;
}

function drawPieces(){
	for (column = 0; column < PIECES_PER_LINE; column++) {
		for (row = 0; row < PIECES_PER_LINE; row++) {

			var piece = pieceLayout[column][row];

			if(piece.y < piece.newY){//going down
				piece.y += ANIMATION_SPEED;
				if((piece.newY - piece.y) < ANIMATION_SPEED){//fill in extra gap
					piece.y = piece.newY;
				}
			}
			if(piece.y > piece.newY ){//going up
				piece.y -= ANIMATION_SPEED;
				if((piece.y - piece.newY ) < ANIMATION_SPEED){//fill in extra gap
					piece.y = piece.newY;
				}
			}
			if(piece.a > piece.newA ){//alpha going down
				piece.a -= FADE_SPEED
				if(piece.a  < FADE_SPEED){//fill in extra gap
					piece.a = piece.newA;
				}
			}
			drawPiece(piece);
		}
	}
}

function drawExtras(){
	for (i = 0; i < extras.length; i++) {
		drawShine(extras[i]);
	}
}

function updateExtras(){
	for (i = 0; i < extras.length; i++) {
		extras[i].frame++;
	}
}

function breakPieces(){
	for (column = 0; column < PIECES_PER_LINE; column++) {
		for (row = 0; row < PIECES_PER_LINE; row++) {
			if(pieceLayout[column][row].broken){
				extras.push({column,row,frame:0});
				pieceLayout[column].splice(row, 1);
				pieceLayout[column][PIECES_PER_LINE-1] = getPiece(column, PIECES_PER_LINE-1);

				//add moving up offset
				let movingUpOffset = 0;
				for (i = 1; i < PIECES_PER_LINE; i++) {
					if (pieceLayout[column][PIECES_PER_LINE-i].y > BOARD_HEIGHT){//one above is also a new piece
						movingUpOffset+=WIDTH_AND_PADDING;
					}
					//stop super breaks
					while (shouldBreak(pieceLayout, column, PIECES_PER_LINE-1)){
						pieceLayout[column][PIECES_PER_LINE-1] = getPiece(column, row);
					}
				}
				pieceLayout[column][PIECES_PER_LINE-1].y = BOARD_HEIGHT + WIDTH_AND_PADDING + movingUpOffset;
			}
		}
	}
	movePieces();
}


function powerUp1(column, row){

	for (i = 0; i < PIECES_PER_LINE; i++) {//break row
		pieceLayout[i][row].id = 'row_gem';
		pieceLayout[i][row].img = PIECE_IMAGES[4];
	}

	for (j = 0; j < PIECES_PER_LINE; j++) {//break column
		pieceLayout[column][j].id = 'row_gem';
		pieceLayout[column][j].img = PIECE_IMAGES[4];
	}
	
}

function powerUpBomb(column, row){
	//break ones around it

	for (col = column - 1; col <= column + 1; col++) {
		for (ro = row - 1; ro <= row + 1; ro++) {
			if(pieceLayout[col] && pieceLayout[col][ro]){
				pieceLayout[col][ro].id = 'row_gem';
				pieceLayout[col][ro].img = PIECE_IMAGES[5];
			}
		}
	}
	
}

//animates pieces to their new index
function movePieces(){
	for (column = 0; column < PIECES_PER_LINE; column++) {
		for (row = 0; row < PIECES_PER_LINE; row++) {
			var y = (PIECE_PADDING + WIDTH_AND_PADDING * row) + BOARD_MARGIN_TOP;
			pieceLayout[column][row].newY = y;
		}
	}
}

function getPiece(column, row){
	var x = (PIECE_PADDING + WIDTH_AND_PADDING * column) + BOARD_MARGIN_LEFT;
	var y = (PIECE_PADDING + WIDTH_AND_PADDING * row) + BOARD_MARGIN_TOP;
	const pieces =
	[
		{
			id: 1,
			img: PIECE_IMAGES[0],
			x,
			y,
			newY: y,
			a: 1,
			newA: 1,
			broken: false
		},
		{
			id: 2,
			img: PIECE_IMAGES[1],
			x,
			y,
			newY: y,
			a: 1,
			newA: 1,
			broken: false
		},
		{
			id: 3,
			img: PIECE_IMAGES[2],
			x,
			y,
			newY: y,
			a: 1,
			newA: 1,
			broken: false
		},
		{
			id: 4,
			img: PIECE_IMAGES[3],
			x,
			y,
			newY: y,
			a: 1,
			newA: 1,
			broken: false
		}
	];
	const rarePieces = [
		{
			id: 'row_gem',
			img: PIECE_IMAGES[4],
			x,
			y,
			newY: y,
			a: 1,
			newA: 1,
			broken: false,
			effect: powerUp1
		},
		{
			id: 'bomb',
			img: PIECE_IMAGES[5],
			x,
			y,
			newY: y,
			a: 1,
			newA: 1,
			broken: false,
			effect: powerUpBomb
		}
	];

	var rand1 = Math.floor((Math.random() * RARE_PIECE_ODDS) + 0);
	if (rand1 == 1){
		var rand2 = Math.floor((Math.random() * rarePieces.length) + 0);
		return rarePieces[rand2];
	}
	else{
		var rand3 = Math.floor((Math.random() * pieces.length) + 0);
		return pieces[rand3];
	}
	
}

function shouldBreak(pieceLayout, column, row){
	var piece = pieceLayout[column][row];
	if (pieceLayout[column - 1] && (pieceLayout[column - 1][row].id === piece.id)){//1 left
		if(pieceLayout[column - 2] && (pieceLayout[column - 2][row].id === piece.id)){//2 left
			return true;
		}
		if (pieceLayout[column + 1] && (pieceLayout[column + 1][row].id === piece.id)){//1 right
			return true;
		}
	}

	if (pieceLayout[column][row - 1] && (pieceLayout[column][row - 1].id === piece.id)){//1 up
		if (pieceLayout[column][row - 2] && (pieceLayout[column][row - 2].id === piece.id)){//2 up
			return true;
		}
		if (pieceLayout[column][row + 1] && (pieceLayout[column][row + 1].id === piece.id)){//1 down
			return true;
		}
	}

	if (pieceLayout[column + 1] && (pieceLayout[column + 1][row].id === piece.id)){//1 right
		if(pieceLayout[column + 2] && (pieceLayout[column + 2][row].id === piece.id)){//2 right
			return true;
		}
	}

	if (pieceLayout[column][row + 1] && (pieceLayout[column][row + 1].id === piece.id)){//1 down
		if (pieceLayout[column][row + 2] && (pieceLayout[column][row + 2].id === piece.id)){//2 down
			return true;
		}
	}
}

function drawSelector(){
	var xCalc = Math.round(cursorX/WIDTH_AND_PADDING) * WIDTH_AND_PADDING - PIECE_WIDTH + BOARD_MARGIN_LEFT;
	var yCalc = Math.round(cursorY/WIDTH_AND_PADDING) * WIDTH_AND_PADDING - PIECE_WIDTH + BOARD_MARGIN_TOP;

	var column = Math.round(cursorX/WIDTH_AND_PADDING)-1;
	var row = Math.round(cursorY/WIDTH_AND_PADDING)-1;

	if (pieceLayout[column] && pieceLayout[column][row] && row != 7){//check its over the board
		ctx.beginPath();
		ctx.lineWidth = 4;
		ctx.strokeStyle = '#ffffff';
		ctx.roundRect(xCalc, yCalc, PIECE_WIDTH, PIECE_WIDTH * 2, 20).stroke();
		ctx.strokeStyle = '#000000';
		ctx.roundRect(xCalc - 2, yCalc - 2, PIECE_WIDTH + 5, (PIECE_WIDTH * 2) + 5, 20).stroke();
	}
}

function drawPiece(piece){
	ctx.beginPath();
	ctx.globalAlpha = piece.a;
	ctx.drawImage(piece.img, piece.x, piece.y, PIECE_WIDTH, PIECE_WIDTH);
	ctx.globalAlpha = 1;
}

function drawShine(item){
	ctx.drawImage(shineSprite, (item.frame * 223), 0, 233, 233, 10 + (WIDTH_AND_PADDING * item.column), 10 + (WIDTH_AND_PADDING * item.row), 300, 300);
}

function drawBoardArea(){
	ctx.fillStyle=BOARD_COLOR;
	ctx.fillRect(BOARD_MARGIN_LEFT,BOARD_MARGIN_TOP,BOARD_WIDTH,BOARD_HEIGHT);
	ctx.rect(BOARD_MARGIN_LEFT,BOARD_MARGIN_TOP,BOARD_WIDTH,BOARD_HEIGHT);
	ctx.stroke();
	ctx.fillStyle='#000000';
}
function hideStuffOffTheEdge(){
	ctx.clearRect(0, BOARD_MARGIN_TOP + BOARD_WIDTH, c.width, BOARD_MARGIN_BOTTOM);//bottom
}

function drawScore(){
	ctx.font = "30px Arial";
	ctx.fillText('Score: ' + score,BOARD_MARGIN_LEFT,50);
}

CanvasRenderingContext2D.prototype.roundRect = function (x, y, w, h, r) {
  if (w < 2 * r) r = w / 2;
  if (h < 2 * r) r = h / 2;
  this.beginPath();
  this.moveTo(x+r, y);
  this.arcTo(x+w, y,   x+w, y+h, r);
  this.arcTo(x+w, y+h, x,   y+h, r);
  this.arcTo(x,   y+h, x,   y,   r);
  this.arcTo(x,   y,   x+w, y,   r);
  this.closePath();
  return this;
}