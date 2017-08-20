
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

function drawPiece(piece){
	ctx.beginPath();
	ctx.globalAlpha = piece.a;
	ctx.drawImage(piece.img, piece.x, piece.y, PIECE_WIDTH, PIECE_WIDTH);
	ctx.globalAlpha = 1;
}
