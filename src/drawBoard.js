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