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