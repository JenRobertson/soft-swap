//animates pieces to their new index
function movePieces(){
	for (column = 0; column < PIECES_PER_LINE; column++) {
		for (row = 0; row < PIECES_PER_LINE; row++) {
			var y = (PIECE_PADDING + WIDTH_AND_PADDING * row) + BOARD_MARGIN_TOP;
			pieceLayout[column][row].newY = y;
		}
	}
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