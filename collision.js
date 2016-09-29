/*
 * Pretty much completely unoptimized code, but it works (ish)
 * 
 * Read about it in the write-up, but this code will check a box of pixels around the player
 * for a certain color, and if that color is found, then generate another box around THAT pixel
 * and check for a white pixel (the pixel color of the player). If that white pixel is found,
 * then we can conclude that there was a collision between an object and the player.
 *
 * The color of the original pixel will tell us what type of object intersected it, and we can
 * do things based on that information
*/
function checkPlayerCollisions() {

	var imageData = ctx.getImageData(worldCenterPos - unitSize / 2, worldCenterPos - unitSize / 2, unitSize, unitSize).data;

	for (var i = 0; i < imageData.length; i += 4) {

		var red = imageData[i];
		var green = imageData[i + 1];
		var blue = imageData[i + 2];
		var alpha = imageData[i + 3];

		// Enemy
		if (red == 0 && green == 153 && blue == 0) {
			var y = (i / 4) / unitSize;
			var x = i % (unitSize / 4);

			var surroundingPixelData = ctx.getImageData(worldCenterPos - (unitSize / 2) + x - 1, worldCenterPos - (unitSize / 2) + y - 1, 3, 3).data;

			for (var j = 0; j < surroundingPixelData.length; j += 4) {
				var red1 = surroundingPixelData[j];
				var green1 = surroundingPixelData[j + 1];
				var blue1 = surroundingPixelData[j + 2];
				var alpha1 = surroundingPixelData[j + 3];

				if (red1 >= 128 && green1 >= 128 && blue1 >= 128) {
					damagePlayer(50);
				}
			}

		}

		// Meteoroids
		if (red == 0 && green == 255 && blue == 255) {
			
			var y = (i / 4) / unitSize;
			var x = i % (unitSize / 4);

			var surroundingPixelData = ctx.getImageData(worldCenterPos - (unitSize / 2) + x - 1, worldCenterPos - (unitSize / 2) + y - 1, 3, 3).data;

			for (var j = 0; j < surroundingPixelData.length; j += 4) {
				var red1 = surroundingPixelData[j];
				var green1 = surroundingPixelData[j + 1];
				var blue1 = surroundingPixelData[j + 2];
				var alpha1 = surroundingPixelData[j + 3];

				if (red1 >= 128 && green1 >= 128 && blue1 >= 128) {
					damagePlayer(35);
				}
			}

		}

		// Enemy Projectile
		if (red == 255 && green == 0 && blue == 255) {

			var y = (i / 4) / unitSize;
			var x = i % (unitSize / 4);

			var surroundingPixelData = ctx.getImageData(worldCenterPos - (unitSize / 2) + x - 1, worldCenterPos - (unitSize / 2) + y - 1, 3, 3).data;

			for (var j = 0; j < surroundingPixelData.length; j += 4) {
				var red1 = surroundingPixelData[j];
				var green1 = surroundingPixelData[j + 1];
				var blue1 = surroundingPixelData[j + 2];
				var alpha1 = surroundingPixelData[j + 3];

				if (red1 >= 128 && green1 >= 128 && blue1 >= 128) {
					damagePlayer(20);
				}
			}

		}

	}
}

