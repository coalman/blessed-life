'use strict';

function create2dArray(width, height) {
	var columns = new Array(width || 0);

	for (var x = 0; x < width || 0; x++) {
		columns[x] = new Array(height || 0);
	}

	return columns;
}

function Board(width, height) {
	this.width = width;
	this.height = height;
	this.cells = create2dArray(width, height);
}

// TODO: add some error checking.

Board.prototype.getCell = function(x, y) {
	return this.cells[x][y];
};
Board.prototype.setCell = function(x, y, value) {
	this.cells[x][y] = value;
};
Board.prototype.toggleCell = function(x, y) {
	this.cells[x][y] = !this.isAlive(x, y);
};
Board.prototype.isInBounds = function(x, y) {
	return (0 <= x && x < this.width) &&
		(0 <= y && y < this.height);
};
Board.prototype.isAlive = function(x, y) {
	return this.getCell(x, y) === true;
};
Board.prototype.isDead = function(x, y) {
	return this.getCell(x, y) !== true;
};
Board.prototype.getLiveNeighbors = function(x, y) {
	var count = (this.isAlive(x, y) ? -1 : 0);
	for (var yD = 0; yD < 3; yD++) {
		for (var xD = 0; xD < 3; xD++) {
			if (this.isInBounds(x + xD - 1, y + yD - 1) && 
				this.isAlive(x + xD - 1, y + yD - 1)) {
				count++;
			}
		}
	}
	return count;
};

module.exports = Board;