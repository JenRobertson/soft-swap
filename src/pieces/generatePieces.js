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