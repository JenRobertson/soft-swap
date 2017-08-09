var COIN_PADDING = 2;
var COIN_WIDTH = 50;
var WIDTH_AND_PADDING = COIN_WIDTH + COIN_PADDING;
var COINS_PER_LINE = 10;
var ANIMATION_SPEED = 5;

var ctx, c, coinLayout, cursorX, cursorY;

window.onload = function () {
	c = document.getElementById("myCanvas");
	ctx = c.getContext("2d");

	c.onmousemove = function(e){
	    cursorX = e.pageX;
	    cursorY = e.pageY;
	}

	c.onclick = function(){
		if(isAnimationDone()){
			swapCoins();
		}
	}

	coinLayout = generateCoinsArray();
	window.requestAnimationFrame(frame);
}

//runs every frame
function frame(){
	ctx.clearRect(0, 0, c.width, c.height);

	if(isAnimationDone()){
		checkForBreaks();
	}

	breakCoins();
	drawCoins();
	drawSelector();

	window.requestAnimationFrame(frame);
}

function generateCoinsArray(){
	var coinLayout = new Array(COINS_PER_LINE);//columns

	for (column = 0; column < COINS_PER_LINE; column++) {
		coinLayout[column] = new Array(COINS_PER_LINE);

		for (row = 0; row < COINS_PER_LINE; row++) {
			coinLayout[column][row] = getCoin(column, row);

			while (shouldBreak(coinLayout, column, row)){
				coinLayout[column][row] = getCoin(column, row);
			}
		}
	}
	return coinLayout;
}

function swapCoins(){
	var column = Math.round(cursorX/WIDTH_AND_PADDING)-1;
	var row = Math.round(cursorY/WIDTH_AND_PADDING)-1;

	var bottomCoin = coinLayout[column][row+1];
	var topCoin = coinLayout[column][row];

	if(bottomCoin && topCoin){
		coinLayout[column][row]= bottomCoin;
		coinLayout[column][row + 1]= topCoin;
	}
	moveCoins();
}

function checkForBreaks(){
	for (column = 0; column < COINS_PER_LINE; column++) {
		for (row = 0; row < COINS_PER_LINE; row++) {
			if(shouldBreak(coinLayout, column, row) && !coinLayout[column][row].broken){
				coinLayout[column][row].broken = true;
			}
		}
	}
}

function isAnimationDone(){
		for (column = 0; column < COINS_PER_LINE; column++) {
			for (row = 0; row < COINS_PER_LINE; row++) {
				if(coinLayout[column][row].y != coinLayout[column][row].newY ){
					return false;
				}
			}
		}
	return true;
}

function drawCoins(){
	for (column = 0; column < COINS_PER_LINE; column++) {
		for (row = 0; row < COINS_PER_LINE; row++) {

			var coin = coinLayout[column][row];

			if(coin.y < coin.newY){//going down
				coin.y += ANIMATION_SPEED;
				if((coin.newY - coin.y) < ANIMATION_SPEED){//fill in extra gap
					coin.y = coin.newY;
				}
			}
			if(coin.y > coin.newY ){//going up
				coin.y -= ANIMATION_SPEED;
				if((coin.y - coin.newY ) < ANIMATION_SPEED){//fill in extra gap
					coin.y = coin.newY;
				}
			}
			drawCoin(coin);
		}
	}
}

function breakCoins(){
	for (column = 0; column < COINS_PER_LINE; column++) {
		for (row = 0; row < COINS_PER_LINE; row++) {
			if(coinLayout[column][row].broken){
				coinLayout[column].splice(row, 1);
				coinLayout[column][COINS_PER_LINE-1] = getCoin(column, COINS_PER_LINE-1);
				coinLayout[column][COINS_PER_LINE-1].y = c.height + WIDTH_AND_PADDING;
			}
		}
	}
	moveCoins();
}

//animates coins to their new index
function moveCoins(){
	for (column = 0; column < COINS_PER_LINE; column++) {
		for (row = 0; row < COINS_PER_LINE; row++) {
			var y = COIN_PADDING + WIDTH_AND_PADDING * row;
			coinLayout[column][row].newY = y;
		}
	}
}

function getCoin(column, row){
	var x = COIN_PADDING + WIDTH_AND_PADDING * column;
	var y = COIN_PADDING + WIDTH_AND_PADDING * row;
	var coins =
	[
		{
			id: 'yellow',
			img: document.getElementById("coin1"),
			x,
			y,
			newY: y,
			broken: false
		},
		{
			id: 'orange',
			img: document.getElementById("coin2"),
			x,
			y,
			newY: y,
			broken: false
		},
		{
			id: 'grey',
			img: document.getElementById("coin3"),
			x,
			y,
			newY: y,
			broken: false
		},
		{
			id: 'green',
			img: document.getElementById("coin4"),
			x,
			y,
			newY: y,
			broken: false
		},
	];
	var rand = Math.floor((Math.random() * coins.length) + 0);
	return coins[rand];
}

function shouldBreak(coinLayout, column, row){
	var coin = coinLayout[column][row];
	if (coinLayout[column - 1] && (coinLayout[column - 1][row].id === coin.id)){//1 left
		if(coinLayout[column - 2] && (coinLayout[column - 2][row].id === coin.id)){//2 left
			return true;
		}
		if (coinLayout[column + 1] && (coinLayout[column + 1][row].id === coin.id)){//1 right
			return true;
		}
	}

	if (coinLayout[column][row - 1] && (coinLayout[column][row - 1].id === coin.id)){//1 up
		if (coinLayout[column][row - 2] && (coinLayout[column][row - 2].id === coin.id)){//2 up
			return true;
		}
		if (coinLayout[column][row + 1] && (coinLayout[column][row + 1].id === coin.id)){//1 down
			return true;
		}
	}

	if (coinLayout[column + 1] && (coinLayout[column + 1][row].id === coin.id)){//1 right
		if(coinLayout[column + 2] && (coinLayout[column + 2][row].id === coin.id)){//2 right
			return true;
		}
	}

	if (coinLayout[column][row + 1] && (coinLayout[column][row + 1].id === coin.id)){//1 down
		if (coinLayout[column][row + 2] && (coinLayout[column][row + 2].id === coin.id)){//2 down
			return true;
		}
	}
}

function drawSelector(){
	var xCalc = Math.round(cursorX/WIDTH_AND_PADDING) * WIDTH_AND_PADDING - WIDTH_AND_PADDING;
	var yCalc = Math.round(cursorY/WIDTH_AND_PADDING) * WIDTH_AND_PADDING - COIN_WIDTH;
	ctx.beginPath();
	ctx.rect(xCalc, yCalc, COIN_WIDTH, COIN_WIDTH * 2);
	ctx.stroke();
	ctx.lineWidth = 3;
}

function drawCoin(coin){
		ctx.beginPath();
		ctx.drawImage(coin.img, coin.x, coin.y, COIN_WIDTH, COIN_WIDTH);
}
