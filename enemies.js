var enemies = [];

var enemyProjectiles = [];

function generateEnemy() {
	// Generate the enemy object
	var enemy = {
		size: unitSize,
		acceleration: 0.07,
		posX: 700,
		posY: 100,
		dx: 0,
		maxDX: 2,
		dy: 0,
		maxDY: 2,
		framesSinceLastShot: 0
	}

	// And return it
	return enemy;
}

function updateEnemies() {
	for (var i = 0; i < enemies.length; i++) {

		var current = enemies[i];

		current.posX -= player.dx + current.dx;
		current.posY += player.dy + current.dy;

		var acceleration = current.acceleration;
		var x = current.posX;
		var y = current.posY;

		// Home towards the player
		if (x < worldCenterPos) {
			current.dx += -acceleration;
		} else {
			current.dx += acceleration;
		}
		if (y < worldCenterPos) {
			current.dy += acceleration;
		} else {
			current.dy += -acceleration;
		}

		// Set maximum DX and DY
		if (current.dx > current.maxDX) {
			current.dx = current.maxDX;
		}
		if (current.dx < -current.maxDX) {
			current.dx = -current.maxDX;
		}
		if (current.dy > current.maxDY) {
			current.dy = current.maxDY;
		}
		if (current.dy < -current.maxDY) {
			current.dy = -current.maxDY;
		}

		// Render the enemy ONLY if it's on screen
		if (x > -unitSize && x < canvas.width + unitSize && y > -unitSize && y < canvas.height + unitSize) {
			drawEnemy(current);
		}

		// If the enemy should shoot again, shoot twice
		current.framesSinceLastShot++;
		if (current.framesSinceLastShot == 45) {
			enemyProjectiles.push(generateEnemyProjectile(current));
			enemyProjectiles.push(generateEnemyProjectile(current));
			current.framesSinceLastShot = 0;
		}

		// Check for collision with the player's projectiles
		for (var j = 0; j < playerProjectiles.length; j++) {
			var proj = playerProjectiles[j];
			var collisionOffsetX = unitSize;
			var collisionOffsetY = unitSize / 2;
			if (proj.posX >= current.posX - collisionOffsetX && proj.posX <= current.posX + collisionOffsetX
				&& proj.posY >= current.posY - collisionOffsetY && proj.posY <= current.posY + collisionOffsetY) {
				enemies.splice(i, 1);
				playerProjectiles.splice(j, 1);
			}

		}
		
	}
}

function drawEnemy(current) {

	// Get some positional values from the current enemy
	var size = current.size;
	var x = current.posX;
	var y = current.posY;

	ctx.fillStyle = '#FFFFFF';

	ctx.strokeStyle = "#009900";
	ctx.lineWidth = 1;

	// Draw the oval shape
	ctx.beginPath();
	ctx.ellipse(x, y, size, size / 2, 0, 0, Math.PI * 2);
	ctx.stroke();
	ctx.closePath();

	// Draw the circle shape
	ctx.beginPath();
	ctx.arc(x, y - size / 4, size / 4, 0, Math.PI * 2);
	ctx.stroke();
	ctx.closePath();

	// If in debug mode, draw the (x, y) coordinates above the enemy as well as
	// the hitbox of the enemy
	if (debug) {

		ctx.fillText(Math.round(x) + ", " + Math.round(y), x, y - unitSize / 1.5);

		var collisionOffsetX = unitSize;
		var collisionOffsetY = unitSize / 2;

		ctx.beginPath();
		ctx.moveTo(x - collisionOffsetX, y - collisionOffsetY);
		ctx.lineTo(x + collisionOffsetX, y - collisionOffsetY);
		ctx.lineTo(x + collisionOffsetX, y + collisionOffsetY);
		ctx.lineTo(x - collisionOffsetX, y + collisionOffsetY);
		ctx.lineTo(x - collisionOffsetX, y - collisionOffsetY);
		ctx.closePath();
		ctx.stroke();

	}

}

function generateEnemyProjectile(currentEnemy) {
	// Create a projectile object
	var projectile = {
		lastingFrames: 180,
		posX: currentEnemy.posX,
		posY: currentEnemy.posY,
		dx: 0,
		dy: 0
	}

	// Get angle from enemy to player
	var theta = Math.atan2((currentEnemy.posY - worldCenterPos), (currentEnemy.posX - worldCenterPos));
	theta -= Math.PI / 2;

	// Add a random angle
	var ran = Math.random();
	ran = ran * Math.PI / 14;
	theta += ran;

	// Calculate the dx and dy values
	var idx = Math.sin(theta) * (unitSize / 5);
	var idy = Math.cos(theta) * (unitSize / 5);

	// Add those values to the projectile's dx and dy (which in this case will always be zero initially)
	projectile.dx += idx;
	projectile.dy += idy;

	// Return the projectile
	return projectile;
}

function updateEnemyProjectiles() {

	for (var i = 0; i < enemyProjectiles.length; i++) {

		var current = enemyProjectiles[i];

		current.posX += current.dx - player.dx;
		current.posY -= current.dy - player.dy;

		// Decrease the frame counter, and if the projectile has no lasting frames splice (delete) i
		// from the enemyProjectiles array
		current.lastingFrames--;
		if (current.lastingFrames == 0) {
			enemyProjectiles.splice(i, 1);
		}

	}

	// Once everything has been updated, draw them
	drawEnemyProjectiles();

}

function drawEnemyProjectiles() {

	for (var i = 0; i < enemyProjectiles.length; i++) {
		var current = enemyProjectiles[i];
		var offset = 1;
		var x = current.posX;
		var y = current.posY;
		ctx.strokeStyle = '#FF00FF';
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