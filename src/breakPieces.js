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