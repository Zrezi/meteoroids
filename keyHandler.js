// A key object to hold the int values for the key functions
var keys = {
	enter: 13,
	escape: 27,
	space: 32,
	left: 37,
	up: 38,
	right: 39,
	down: 40,
	s: 83,
	tilde: 192
}

function keyPressed(e) {
	if (e.keyCode == keys.escape) {
		if (paused) {
			paused = false;
		} else {
			paused = true;
		}
	}

	if (!paused) {

		if (e.keyCode == keys.right) {
			b_isPlayerRotateRight = true;
		}

		if (e.keyCode == keys.left) {
			b_isPlayerRotateLeft = true;
		}

		if (e.keyCode == keys.up) {
			b_isPlayerBoost = true;
		}

		if (e.keyCode == keys.down) {
			b_isPlayerBrake = true;
		}

		if (e.keyCode == keys.s) {
			b_isPlayerShield = true;
		}

		if (e.keyCode == keys.space) {
			shootProjectile();
		}

		if (e.keyCode == keys.tilde) {
			if (debug) {
				debug = false;
			} else {
				debug = true;
			}
		}

		if (e.keyCode == keys.enter) {
			if (!started) {
				started = true;
			}
		}

	}

}

// Key Release function, handles updating the variables when keys are released
function keyReleased(e) {
	if (!paused) {

		if (e.keyCode == keys.right) {
			b_isPlayerRotateRight = false;
		}

		if (e.keyCode == keys.left) {
			b_isPlayerRotateLeft = false;
		}

		if (e.keyCode == keys.up) {
			b_isPlayerBoost = false;
		}

		if (e.keyCode == keys.down) {
			b_isPlayerBrake = false;
		}

		if (e.keyCode == keys.s) {
			b_isPlayerShield = false;
		}

	}

}