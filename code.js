

var COIN_PADDING = 2;
var COIN_WIDTH = 50;
var COINS_PER_LINE = 10;

window.onload = function () { 
	var c = document.getElementById("myCanvas");
	var ctx = c.getContext("2d");
	
	var coinLayout = generateCoinsArray();
	drawCoins(coinLayout);
}

function generateCoinsArray(){
	var coinLayout = new Array(COINS_PER_LINE);//columns

	for (column = 0; column < COINS_PER_LINE; column++) { 
		coinLayout[column] = new Array(COINS_PER_LINE);

		for (row = 0; row < COINS_PER_LINE; row++) { 
			coinLayout[column][row] = getCoin(column, row);

			while (shouldBreak(coinLayout, column, row)){
				coinLayout[column][row] = getCoin(column, row);
				//drawCircle(coinLayout[column][row]);
			}
		}
	}
	return coinLayout;
}

function drawCoins(coinLayout){
	for (column = 0; column < COINS_PER_LINE; column++) { 
		for (row = 0; row < COINS_PER_LINE; row++) { 
			var coin = coinLayout[column][row];
			ctx.drawImage(coin.img, coin.x, coin.y);

		}
	}
}

function getCoin(column, row){
	var x = COIN_PADDING + (COIN_WIDTH + COIN_PADDING) * column;
	var y = COIN_PADDING + (COIN_WIDTH + COIN_PADDING) * row;
	var coins = 
	[
		{
			id: 1,
			img: document.getElementById("coin1"),
			x,
			y
		},
		{
			id: 2,
			img: document.getElementById("coin2"),
			x,
			y
		},
		{
			id: 3,
			img: document.getElementById("coin3"),
			x,
			y
		},
		{
			id: 4,
			img: document.getElementById("coin4"),
			x,
			y
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
			// drawCircle(coinLayout[column - 1][row]);
			// drawCircle(coinLayout[column - 2][row]);	
		}
	}

	if (coinLayout[column][row - 1] && (coinLayout[column][row - 1].id === coin.id)){//1 up
		if (coinLayout[column][row - 2] && (coinLayout[column][row - 2].id === coin.id)){//2 up
			return true;
			// drawCircle(coinLayout[column][row - 1]);
			// drawCircle(coinLayout[column][row - 2]);	
		}
	}
}

function drawCircle(coin){
	var circleSize = COIN_WIDTH/2;
	ctx.beginPath();
	ctx.arc(coin.x + circleSize, coin.y + circleSize, circleSize + 3,0,2*Math.PI);
	ctx.lineWidth=10;
	ctx.stroke();
}