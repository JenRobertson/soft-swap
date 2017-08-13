var PIECE_PADDING = 0;
var PIECE_WIDTH = 100;
var WIDTH_AND_PADDING = PIECE_WIDTH + PIECE_PADDING;
var PIECES_PER_LINE = 8;
var ANIMATION_SPEED = 10;
var PIECE_IMAGES = [
	document.getElementById("mookie"),
	document.getElementById("chicken"),
	document.getElementById("alpaca"),
	document.getElementById("toast"),
];


//http://editor.method.ac

var ctx, c, pieceLayout, cursorX, cursorY;

window.onload = function () {
	c = document.getElementById("myCanvas");
	ctx = c.getContext("2d");

	c.onmousemove = function(e){
	    cursorX = e.pageX;
	    cursorY = e.pageY;
	}

	c.onclick = function(){
		if(isAnimationDone()){
			swapPieces();
		}
	}
	pieceLayout = generatePiecesArray();
	window.requestAnimationFrame(frame);
}

//runs every frame
function frame(){
	ctx.clearRect(0, 0, c.width, c.height);

	if(isAnimationDone()){
		checkForBreaks();
	}

	breakPieces();
	drawPieces();
	drawSelector();

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
		pieceLayout[column][row]= bottomPiece;
		pieceLayout[column][row + 1]= topPiece;
	}
	movePieces();
}

function checkForBreaks(){
	for (column = 0; column < PIECES_PER_LINE; column++) {
		for (row = 0; row < PIECES_PER_LINE; row++) {
			if(shouldBreak(pieceLayout, column, row) && !pieceLayout[column][row].broken){
				pieceLayout[column][row].broken = true;
			}
		}
	}
}

function isAnimationDone(){
		for (column = 0; column < PIECES_PER_LINE; column++) {
			for (row = 0; row < PIECES_PER_LINE; row++) {
				if(pieceLayout[column][row].y != pieceLayout[column][row].newY ){
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
			drawPiece(piece);
		}
	}
}

function breakPieces(){
	for (column = 0; column < PIECES_PER_LINE; column++) {
		for (row = 0; row < PIECES_PER_LINE; row++) {
			if(pieceLayout[column][row].broken){
				pieceLayout[column].splice(row, 1);
				pieceLayout[column][PIECES_PER_LINE-1] = getPiece(column, PIECES_PER_LINE-1);
				//add animation delay
				let animationDelay = 0;
				for (i = 1; i < PIECES_PER_LINE; i++) {
					if (pieceLayout[column][PIECES_PER_LINE-i].y > c.height){//one above is also a new piece
						animationDelay+=WIDTH_AND_PADDING;
					}
				}
				pieceLayout[column][PIECES_PER_LINE-1].y = c.height + WIDTH_AND_PADDING + animationDelay;
			}
		}
	}
	movePieces();
}

//animates pieces to their new index
function movePieces(){
	for (column = 0; column < PIECES_PER_LINE; column++) {
		for (row = 0; row < PIECES_PER_LINE; row++) {
			var y = PIECE_PADDING + WIDTH_AND_PADDING * row;
			pieceLayout[column][row].newY = y;
		}
	}
}

function getPiece(column, row){
	var x = PIECE_PADDING + WIDTH_AND_PADDING * column;
	var y = PIECE_PADDING + WIDTH_AND_PADDING * row;
	var pieces =
	[
		{
			id: 1,
			img: PIECE_IMAGES[0],
			x,
			y,
			newY: y,
			broken: false
		},
		{
			id: 2,
			img: PIECE_IMAGES[1],
			x,
			y,
			newY: y,
			broken: false
		},
		{
			id: 3,
			img: PIECE_IMAGES[2],
			x,
			y,
			newY: y,
			broken: false
		},
		{
			id: 4,
			img: PIECE_IMAGES[3],
			x,
			y,
			newY: y,
			broken: false
		},
	];
	var rand = Math.floor((Math.random() * pieces.length) + 0);
	return pieces[rand];
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
	var xCalc = Math.round(cursorX/WIDTH_AND_PADDING) * WIDTH_AND_PADDING - PIECE_WIDTH;
	var yCalc = Math.round(cursorY/WIDTH_AND_PADDING) * WIDTH_AND_PADDING - PIECE_WIDTH;
	ctx.beginPath();
	// ctx.rect(xCalc, yCalc, PIECE_WIDTH, PIECE_WIDTH * 2);
	ctx.lineWidth = 4;
	ctx.strokeStyle = '#ffffff';
	ctx.roundRect(xCalc, yCalc, PIECE_WIDTH, PIECE_WIDTH * 2, 20).stroke();
	ctx.strokeStyle = '#000000';
	ctx.roundRect(xCalc - 2, yCalc - 2, PIECE_WIDTH + 5, (PIECE_WIDTH * 2) + 5, 20).stroke();


}

function drawPiece(piece){
		ctx.beginPath();
		ctx.drawImage(piece.img, piece.x, piece.y, PIECE_WIDTH, PIECE_WIDTH);
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