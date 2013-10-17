var Board = require('./board');
var Game = require('./game');
var StringRenderer = require('./string_renderer');

function App(config) {
	var board = new Board(config.width, config.height);
	this.game = new Game(board);

	config.liveCells.forEach(function(liveCell) {
		board.setCell(liveCell[0], liveCell[1], true);
	});

	this.renderer = new StringRenderer();
	this.renderer.emptySymbol = config.deadCell;
	this.renderer.lifeSymbol = config.liveCell;
}

App.prototype.renderBoard = function() {
	return this.renderer.render(this.game.board);
}
App.prototype.tick = function() {
	this.game.tick();
};

module.exports = App;