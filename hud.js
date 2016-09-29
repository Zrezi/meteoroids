var barWidth;
var barHeight;
var debugY;

function drawHud() {

	// Draw Health and Energy Borders
	ctx.strokeStyle = '#FFFFFF';
	ctx.beginPath();
	ctx.rect(unitSize, unitSize, barWidth, barHeight);
	ctx.rect(unitSize, unitSize * 2, barWidth, barHeight);
	ctx.closePath();
	ctx.stroke();

	// Calculate how large the rect's should be
	var healthPixels = (player.health / i_maxHealth) * (barWidth);
	var energyPixels = (player.energy / i_maxEnergy) * (barWidth);

	// Fill in the borders for health and energy with red and green respectively
	ctx.beginPath();
	ctx.fillStyle = '#FF4400';
	ctx.fillRect(unitSize, unitSize, healthPixels, barHeight);
	ctx.fillStyle = '#11FF11';
	ctx.fillRect(unitSize, unitSize * 2, energyPixels, barHeight);
	ctx.fill();
	ctx.closePath();

	// The debug options
	if (debug) {

		ctx.fillStyle = '#FFFFFF';

		debugY = unitSize * 4;

		var x = Math.round(player.posX);
		var y = Math.round(player.posY);

		ctx.fillText("X:     " + x, unitSize, debugY);
		ctx.fillText("Y:     " + y, unitSize, incrementDebugY());
		ctx.fillText("GridX: " + gridX, unitSize, incrementDebugY());
		ctx.fillText("GridY: " + gridY, unitSize, incrementDebugY());
		incrementDebugY(); // add space
		ctx.fillText("Left:       " + isPlayerTurningLeft(), unitSize, incrementDebugY());
		ctx.fillText("Right:      " + isPlayerTurningRight(), unitSize, incrementDebugY());
		ctx.fillText("Boost:      " + isPlayerBoosting(), unitSize, incrementDebugY());
		ctx.fillText("Shield:     " + isPlayerShielding(), unitSize, incrementDebugY());
		ctx.fillText("Invincible: " + isInvincible(), unitSize, incrementDebugY());

	}

}

function incrementDebugY() {
	debugY += 10;
	return debugY;
}