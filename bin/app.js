'use strict';

var blessed = require('blessed');
var fs = require('fs');
var path = require('path');
var lib = path.join(path.dirname(fs.realpathSync(__filename)), '../lib');
var Game = require(lib + '/game.js');
var Board = require(lib + '/board.js');

var board = new Board(20, 10);
board.setCell(1, 0, true);
board.setCell(1, 1, true);
board.setCell(1, 2, true);
var game = new Game(board);

// Create a screen object.
var screen = blessed.screen();

// Create a box perfectly centered horizontally and vertically.
var box = blessed.box({
  top: '0',
  left: '0',
  width: '100%',
  height: '100%',
  content: '{bold}Loading...{/bold}',
  tags: true,
  style: {
    fg: 'white',
    bg: 'black'
  }
});

function renderBoard(board) {
	var s = '';
	for (var y = 0; y < board.height; y++) {
		for (var x = 0; x < board.width; x++) {
			s += (board.isAlive(x, y) ? '1' : '0');
		}
		s += '\n';
	}
	return s;
}
box.setContent(renderBoard(board));

// Append our box to the screen.
screen.append(box);

screen.key(['space'], function(ch, key) {
	game.tick();
	box.setContent(renderBoard(game.board));
	screen.render();
});

// Quit on Escape, q, or Control-C.
screen.key(['escape', 'q', 'C-c'], function(ch, key) {
  return process.exit(0);
});

// Focus our element.
box.focus();

// Render the screen.
screen.render();