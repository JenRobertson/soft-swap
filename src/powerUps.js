function powerUp1(column, row){

	for (i = 0; i < PIECES_PER_LINE; i++) {//break row

		if(pieceLayout[i][row].effect && pieceLayout[i][row].broken === false){//if its another powerup
			//break and do effect
			pieceLayout[i][row].broken = true;
			pieceLayout[i][row].effect(i,row);
		}
		if(pieceLayout[i] && pieceLayout[i][row]){
			pieceLayout[i][row].broken = true;
		}
	}

	for (j = 0; j < PIECES_PER_LINE; j++) {//break column
		if(pieceLayout[column][j].effect && pieceLayout[column][j].broken === false){
			pieceLayout[column][j].broken = true;
			pieceLayout[column][j].effect(column, j);
		}
		if(pieceLayout[column] && pieceLayout[column][j]){
			pieceLayout[column][j].broken = true;
		}
	}
	
}

function powerUpBomb(column, row){
	//break ones around it

	for (col = column - 1; col <= column + 1; col++) {
		for (ro = row - 1; ro <= row + 1; ro++) {
			if(pieceLayout[col] && pieceLayout[col][ro]){
				if(pieceLayout[col][ro].effect  &&  pieceLayout[col][ro].broken === false){
					pieceLayout[col][ro].broken = true;
					pieceLayout[col][ro].effect(col,ro);
				}
				if(pieceLayout[col] && pieceLayout[col][ro]){
					pieceLayout[col][ro].broken = true;
				}
			}
		}
	}
}