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

function drawShine(item){
	ctx.drawImage(shineSprite, (item.frame * 223), 0, 233, 233, 10 + (WIDTH_AND_PADDING * item.column), 10 + (WIDTH_AND_PADDING * item.row), 300, 300);
}
