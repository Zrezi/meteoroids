var gridSquares = [];
var worldCenterPos;
var oldGridX = 0;
var oldGridY = 0;
var gridX = 0;
var gridY = 0;

function updateGrid() {

	for (var i = 0; i < gridSquares.length; i++) {
		var current = gridSquares[i];
		current.posX -= player.dx;
		current.posY += player.dy;
	}

}

function drawGrid() {

	// For each of the 9 grid squares, draw a square at the target x,y
	// location with the offset value calculated here
	for (var i = 0; i < gridSquares.length; i++) {
		var current = gridSquares[i];
		var size = current.size;
		var offset = size / 2;
		var x = current.posX;
		var y = current.posY;
		ctx.strokeStyle = '#555555';
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

function regenerateGrid() {

	// Refresh gridSquares to a blank array
	gridSquares = [];

	// Generate the squares like a matrix around the player
	// [ 11 12 13 ]
	// | 21 22 23 |
	// [ 31 32 33 ]

	var grid11 = generateGridPiece();
	grid11.posX = worldCenterPos - canvas.width - player.posX + (canvas.width * gridX);
	grid11.posY = worldCenterPos - canvas.height - player.posY + (canvas.height * gridY);
	gridSquares.push(grid11);

	var grid12 = generateGridPiece();
	grid12.posX = worldCenterPos - player.posX + (canvas.width * gridX);
	grid12.posY = worldCenterPos - canvas.height - player.posY + (canvas.height * gridY);
	gridSquares.push(grid12);

	var grid13 = generateGridPiece();
	grid13.posX = worldCenterPos + canvas.width - player.posX + (canvas.width * gridX);
	grid13.posY = worldCenterPos - canvas.height - player.posY + (canvas.height * gridY);
	gridSquares.push(grid13);

	var grid21 = generateGridPiece();
	grid21.posX = worldCenterPos - canvas.width - player.posX + (canvas.width * gridX)
	grid21.posY = worldCenterPos - player.posY + (canvas.height * gridY);
	gridSquares.push(grid21);

	var grid22 = generateGridPiece();
	grid22.posX = worldCenterPos - player.posX + (canvas.width * gridX);
	grid22.posY = worldCenterPos - player.posY + (canvas.height * gridY);
	gridSquares.push(grid22);

	var grid23 = generateGridPiece();
	grid23.posX = worldCenterPos + canvas.width - player.posX + (canvas.width * gridX);
	grid23.posY = worldCenterPos - player.posY + (canvas.height * gridY);
	gridSquares.push(grid23);

	var grid31 = generateGridPiece();
	grid31.posX = worldCenterPos - canvas.width - player.posX + (canvas.width * gridX);
	grid31.posY = worldCenterPos + canvas.height - player.posY + (canvas.height * gridY);
	gridSquares.push(grid31);

	var grid32 = generateGridPiece();
	grid32.posX = worldCenterPos - player.posX + (canvas.width * gridX);
	grid32.posY = worldCenterPos + canvas.height - player.posY + (canvas.height * gridY);
	gridSquares.push(grid32);

	var grid33 = generateGridPiece();
	grid33.posX = worldCenterPos + canvas.width - player.posX + (canvas.width * gridX);
	grid33.posY = worldCenterPos + canvas.height - player.posY + (canvas.height * gridY);
	gridSquares.push(grid33);
}

function generateGridPiece() {
	// Create the grid object
	var grid = {
		posX: 0,
		posY: 0,
		size: canvas.width
	}

	// And return it
	return grid;
}