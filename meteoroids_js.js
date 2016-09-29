var canvas;
var ctx;
var FPS = 60;
var unitSize;
var previousWindowSize;

var fontSize;
var fontType;

// useless comment
var debug = false;
var started = false;
var paused = false;
var gameOver = false;

var framesSinceLastCollisionCheck = 0;
var frameToCheckCollision = 4;

$(document).ready(function() {

	document.addEventListener('keydown', keyPressed, true);
	document.addEventListener('keyup', keyReleased, true);

	init();

	window.onresize = resizeCanvas;

});

// Init function
function init() {
	canvas = $('#canvas')[0];
	ctx = canvas.getContext("2d");

	previousWindowSize = canvas.width;

	resizeCanvas();

	meteors.push(generateRandomMeteorAtPosition(200, 200, true, true, true, true));

	enemies.push(generateEnemy());

	ctx.strokeStyle = '#FFFFFF';
	ctx.lineWidth = 1;

	worldCenterPos = canvas.width / 2;

	regenerateGrid();

	run();
}

function resizeCanvas() {

	// Update the width and height
    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;

    // Set the canvas equal to a square with the smallest dimension
    if (canvas.width > canvas.height) {
    	canvas.width = canvas.height;
    } else {
    	canvas.height = canvas.width;
    }

    // Update the unit size with the square dimension
	unitSize = canvas.width / 32;

	// Take a ratio of the new size compared with the old size
	var ratio = canvas.width / previousWindowSize;

	worldCenterPos = worldCenterPos * ratio;

	// Update player values
	player.posX = ratio * player.posX;
	player.posY = ratio * player.posY;
	player.dx = ratio * player.dx;
	player.dy = ratio * player.dy;

	// Update player projectile position and movement values
	for (var i = 0; i < playerProjectiles.length; i++) {
		var current = playerProjectiles[i];
		current.posX = ratio * current.posX;
		current.posY = ratio * current.posY;
		current.dx = ratio * current.dx;
		current.dy = ratio * current.dy;
	}

	// Update meteor dimensions and scale the position / movement values
	for (var i = 0; i < meteors.length; i++) {
		var current = meteors[i];
		current.size = unitSize;
		current.posX = ratio * current.posX;
		current.posY = ratio * current.posY;
		current.dx = ratio * current.dx;
		current.dy = ratio * current.dy;
	}

	// Update enemy positions and movements
	for (var i = 0; i < enemies.length; i++) {
		var current = enemies[i];
		current.size = ratio * current.size;
		current.posX = ratio * current.posX;
		current.posY = ratio * current.posY;
		current.dx = ratio * current.dx;
		current.maxDX = ratio * current.maxDX;
		current.dy = ratio * current.dy;
		current.maxDY = ratio * current.maxDY;
	}

	// Update enemy projectile position and movement values
	for (var i = 0; i < updateEnemyProjectiles.length; i++) {
		var current = enemyProjectiles[i];
		current.posX = ratio * current.posX;
		current.posY = ratio * current.posY;
		current.dx = ratio * current.dx;
		current.dy = ratio * current.dy;
	}

	// Update grid position and size values
	for (var i = 0; i < gridSquares.length; i++) {
		var current = gridSquares[i];
		current.size = ratio * current.size;
		current.posX = ratio * current.posX;
		current.posY = ratio * current.posY;
	}

	// Update the font size
	fontSize = unitSize / 2.5;
	fontType = "monospace";
	ctx.font = fontSize + 'pt ' + fontType;

	// Update the HUD sizes
	barWidth = unitSize * 8;
	barHeight = unitSize / 2;

	// Update the 'old' window size
	previousWindowSize = canvas.width;
}

function run() {

	setInterval(function() {

		// Clear the screen
		ctx.clearRect(0, 0, canvas.width, canvas.height);

		if (!started) {
			drawStart();
		}

		if (paused) {
			drawPause();
		}

		if (!paused && started && !gameOver) {

			// Update and draw the grid
			updateGrid();
			drawGrid();

			// Update and draw the meteors that are on screen
			updateMeteoroids();
			
			// Draw the HUD
			drawHud();

			// Update and draw player's projectiles
			updatePlayerProjectiles();
			drawPlayerProjectiles();

			updateEnemies();
			updateEnemyProjectiles();

			// Update and draw the player
			updatePlayer();

			// Don't run collision check every frame because it can be pretty intensive
			framesSinceLastCollisionCheck++;
			if (framesSinceLastCollisionCheck == frameToCheckCollision) {
				checkPlayerCollisions();
				framesSinceLastCollisionCheck = 0;
			}

		}

	}, 1000 / FPS);

}

function drawStart() {

	ctx.fillStyle = '#FFFFFF';
	ctx.textAlign = 'center';
	ctx.font = (fontSize * 4) + 'pt ' + fontType;

	ctx.fillText("- METEROIDS -", worldCenterPos, worldCenterPos - unitSize * 2);

	ctx.font = (fontSize * 2) + 'pt ' + fontType;

	ctx.fillText("Press Enter To Play", worldCenterPos, worldCenterPos);

	ctx.font = fontSize + 'pt ' + fontType;
	ctx.textAlign = 'left';

}

function drawPause() {

	ctx.fillStyle = '#FFFFFF';
	ctx.textAlign = 'center';
	ctx.font = (fontSize * 3) + 'pt ' + fontType;

	ctx.fillText("- PAUSED -", worldCenterPos, worldCenterPos);

	ctx.font = fontSize + 'pt ' + fontType;
	ctx.textAlign = 'left';

}