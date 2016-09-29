var b_isPlayerRotateRight = false;
var b_isPlayerRotateLeft = false;
var b_isPlayerBoost = false;
var b_isPlayerBrake = false;
var b_isPlayerShield = false;
var i_maxHealth = 100;
var i_maxEnergy = 100;
var player = {
	health: i_maxHealth,
	energy: i_maxEnergy,
	rotation: 0,
	acceleration: 0.25,
	posX: 0,
	posY: 0,
	dx: 0,
	dy: 0
}
var playerProjectiles = [];
var framesSinceLastEnergyUse = 0;

var invincibilityFrames = 0;
var maxInvincibilityFrames = 60;
var waitingFrame = false;

// If the player isn't invincible, subtract health
function damagePlayer(damage) {
	if (!isInvincible()) {
		player.health -= damage;
		if (player.health < 0) {
			player.health = 0;
		}
		setInvincible();
	}
}

// Generate a projectile and remove some of the player's energy
function shootProjectile() {
	if (player.energy > 0) {
		playerProjectiles.push(generatePlayerProjectile());
		player.energy -= 2;
		framesSinceLastEnergyUse = 0;
	}
}
function generatePlayerProjectile() {
	var projectile = {
		lastingFrames: 150,
		posX: canvas.width / 2,
		posY: canvas.height / 2,
		dx: 0,
		dy: 0
	}
	var idx = Math.sin(player.rotation*Math.PI/180) * (unitSize / 5);
	var idy = Math.cos(player.rotation*Math.PI/180) * (unitSize / 5);
	projectile.dx += idx + player.dx;
	projectile.dy += idy + player.dy;
	return projectile;
}

function updatePlayerProjectiles() {
	for (var i = 0; i < playerProjectiles.length; i++) {
		var current = playerProjectiles[i];
		current.posX += current.dx - player.dx;
		current.posY -= current.dy - player.dy;
		current.lastingFrames--;
		if (current.lastingFrames == 0) {
			playerProjectiles.splice(i, 1);
		}
	}
}

function drawPlayerProjectiles() {
	for (var i = 0; i < playerProjectiles.length; i++) {
		var current = playerProjectiles[i];
		var offset = 1;
		var x = current.posX;
		var y = current.posY;
		ctx.strokeStyle = '#FFFF00';
		ctx.lineWidth = 1;
		ctx.beginPath();
		ctx.moveTo(x - offset, y - offset);
		ctx.lineTo(x - offset, y + offset);
		ctx.lineTo(x + offset, y + offset);
		ctx.lineTo(x + offset, y - offset);
		ctx.lineTo(x - offset, y - offset);
		ctx.closePath();
		ctx.stroke();
	}
}

function updatePlayer() {
	// If the right button is pressed, rotate right
	if (isPlayerTurningRight()) {
		player.rotation += 4;
		if (player.rotation >= 360) {
			player.rotation = 0;
		}
	}
	// If the left button is pressed, rotate left
	if (isPlayerTurningLeft()) {
		player.rotation -= 4;
		if (player.rotation <= 0) {
			player.rotation = 360;
		}
	}
	// If UP is pressed, boost
	if (isPlayerBoosting()) {
		var idx = Math.sin(player.rotation*Math.PI/180) * (unitSize / 120);
		var idy = Math.cos(player.rotation*Math.PI/180) * (unitSize / 120);
		player.dx += idx;
		player.dy += idy;
	} else {
		if (b_isPlayerBrake) {
			// added the 0.1 nonsense to stop the calculation going forever getting
			// infintesimaly smaller
			if (Math.abs(player.dx) < 0.1) {
				player.dx = 0;
			} else {
				player.dx -= player.dx / 20;
			}
			if (Math.abs(player.dy) < 0.1) {
				player.dy = 0;
			} else {
				player.dy -= player.dy / 20;
			}
		}
	}

	player.posX += player.dx;
	player.posY -= player.dy;

	// Energy Gain
	framesSinceLastEnergyUse++;
	if (framesSinceLastEnergyUse > 120 && player.energy < i_maxEnergy) {
		player.energy++;
		framesSinceLastEnergyUse -= 4;
	}

	// Shield
	if (player.energy > 0 && b_isPlayerShield) {
		player.energy -= 0.25;
		framesSinceLastEnergyUse = 0;
	}

	// Get the current grid location
	gridX = Math.round(player.posX / canvas.width);
	gridY = Math.round(player.posY / canvas.height);

	// If the player changed grids, regenerate the grid around the current
	// grid square
	if (gridX != oldGridX) {
		oldGridX = gridX;
		regenerateGrid();
	}
	if (gridY != oldGridY) {
		oldGridY = gridY;
		regenerateGrid();
	}

	// Remove invincibility frames
	if (invincibilityFrames > 0) {
		invincibilityFrames--;
	}

	// Draw the player
	drawPlayer();

}

function setInvincible() {
	invincibilityFrames = maxInvincibilityFrames;
}

function drawPlayer() {

	// If the player is invincible, stop drawing the player for 12 frames
	if (isInvincible() && waitingFrame != 0) {
		waitingFrame--;
		return;
	}
	waitingFrame = 12;

	// Get the middle of the screen
	var midX = worldCenterPos;
	var midY = worldCenterPos;

	ctx.strokeStyle = '#FFFFFF';
	ctx.lineWidth = 1;

	// Rotate the world as if the ship was straight up and down
	ctx.translate(midX, midY);
	ctx.rotate(player.rotation*Math.PI/180);
	ctx.translate(-midX, -midY);

	// Draw the ship
	ctx.beginPath();
	ctx.moveTo(midX, midY - unitSize / 3);
	ctx.lineTo(midX + unitSize / 3, midY + unitSize / 3);
	ctx.lineTo(midX, midY + unitSize / 6);
	ctx.lineTo(midX - unitSize / 3, midY + unitSize / 3);
	ctx.lineTo(midX, midY - unitSize / 3);
	ctx.closePath();
	ctx.stroke();

	// If boosting, draw the "flames"
	if (isPlayerBoosting()) {
		ctx.strokeStyle = "#FFFF00"
		ctx.beginPath();
		ctx.moveTo(midX + unitSize / 3, midY + unitSize / 3);
		ctx.lineTo(midX, midY + unitSize / 2);
		ctx.lineTo(midX - unitSize / 3, midY + unitSize / 3);
		ctx.closePath();
		ctx.stroke();

		ctx.strokeStyle = "#FF0000"
		ctx.beginPath();
		ctx.moveTo(midX + unitSize / 4, midY + unitSize / 3);
		ctx.lineTo(midX, midY + unitSize / 1.5);
		ctx.lineTo(midX - unitSize / 4, midY + unitSize / 3);
		ctx.closePath();
		ctx.stroke();
	}

	// If shielding, draw a blueish circle around the ship
	if (isPlayerShielding()) {
		ctx.strokeStyle = "#0099FF";
		ctx.beginPath();
		ctx.arc(canvas.width / 2, canvas.height / 2, unitSize, 2 * Math.PI, false);
		ctx.closePath();
		ctx.stroke();
	}

	// Rotate the world back to it's original position
	ctx.translate(midX, midY);
	ctx.rotate(-(player.rotation*Math.PI/180));
	ctx.translate(-midX, -midY);

	if (debug) {

		// Draw the player's hitbox
		ctx.strokeStyle = '#888888';
		ctx.lineWidth = 1;
		worldCenterPos - unitSize, worldCenterPos - unitSize, unitSize * 2, unitSize * 2
		ctx.beginPath();
		ctx.moveTo(worldCenterPos - unitSize / 2, worldCenterPos - unitSize / 2);
		ctx.lineTo(worldCenterPos + unitSize / 2, worldCenterPos - unitSize / 2);
		ctx.lineTo(worldCenterPos + unitSize / 2, worldCenterPos + unitSize / 2);
		ctx.lineTo(worldCenterPos - unitSize / 2, worldCenterPos + unitSize / 2);
		ctx.lineTo(worldCenterPos - unitSize / 2, worldCenterPos - unitSize / 2);
		ctx.closePath();
		ctx.stroke();
		
	}
}

function isInvincible() {
	if (invincibilityFrames == 0) {
		return false;
	}
	return true;
}

function isPlayerBoosting() {
	if (b_isPlayerBoost) {
		return true;
	} else {
		return false;
	}
}

function isPlayerTurningRight() {
	if (b_isPlayerRotateRight) {
		return true;
	} else {
		return false;
	}
}

function isPlayerTurningLeft() {
	if (b_isPlayerRotateLeft) {
		return true;
	} else {
		return false;
	}
}

function isPlayerShielding() {
	if (b_isPlayerShield) {
		return true;
	} else {
		return false;
	}
}