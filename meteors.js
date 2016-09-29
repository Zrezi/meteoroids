var meteors = [];

function updateMeteoroids() {

	for (var i = 0; i < meteors.length; i++) {

		var current = meteors[i];
		current.rotation += current.dr;

		current.posX -= player.dx + current.dx;
		current.posY += player.dy + current.dy;

		var x = current.posX;
		var y = current.posY;

		// Render the meteor ONLY if it's on screen
		if (x > -unitSize && x < canvas.width + unitSize && y > -unitSize && y < canvas.height + unitSize) {
			drawMeteoroid(current);
		}

	}

}

function drawMeteoroid(current) {
	var offset = current.size / 2;
	var rot = current.rotation;
	var x = current.posX;
	var y = current.posY;

	ctx.fillStyle = '#FFFFFF';

	if (debug) {
		ctx.fillText(Math.round(x) + ", " + Math.round(y), x, y - unitSize / 1.5);
	}

	ctx.translate(x, y);
	ctx.rotate(rot*Math.PI/180);
	ctx.translate(-x, -y);

	ctx.strokeStyle = '#00FFFF';
	ctx.lineWidth = 1;

	ctx.beginPath();
	ctx.moveTo(x - offset, y - offset);
	ctx.lineTo(x - offset, y + offset);
	ctx.lineTo(x + offset, y + offset);
	ctx.lineTo(x + offset, y - offset);
	ctx.lineTo(x - offset, y - offset);
	ctx.closePath();
	ctx.stroke();

	ctx.translate(x, y);
	ctx.rotate(-(rot*Math.PI/180));
	ctx.translate(-x, -y);
}

// ------------------ //
// --- GENERATION --- //
// ------------------ //

function generateMeteor() {
	var meteor = {
		size: unitSize,
		rotation: 0,
		dr: 0,
		posX: 0,
		posY: 0,
		dx: 0,
		dy: 0

	}
	return meteor;
}

function generateMeteorAtPosition(x, y) {
	var meteor = generateMeteor();

	meteor.posX = x;
	meteor.posY = y;

	return meteor;
}

function generateRandomMeteor(startingRotation, shouldRotate, hasDX, hasDY) {
	
	var meteor = generateMeteor();

	if (startingRotation) {
		meteor.rotation = Math.random() * 360;
	}
	if(shouldRotate) {
		meteor.dr = Math.random();
		meteor.dr *= Math.floor(Math.random()*2) == 1 ? 1 : -1;
	}
	if (hasDX) {
		meteor.dx = Math.random();
		meteor.dx *= Math.floor(Math.random()*2) == 1 ? 1 : -1;
	}
	if (hasDY) {
		meteor.dy = Math.random();
		meteor.dy *= Math.floor(Math.random()*2) == 1 ? 1 : -1;
	}

	return meteor;

}

function generateRandomMeteorAtPosition(x, y, startingRotation, shouldRotate, hasDX, hasDY) {
	
	var meteor = generateRandomMeteor(startingRotation, shouldRotate, hasDX, hasDY);
	meteor.posX = x;
	meteor.posY = y;
	return meteor;

}