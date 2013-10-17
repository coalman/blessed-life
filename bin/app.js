'use strict';

var program = require('commander');
var blessed = require('blessed');
var fs = require('fs');
var path = require('path');
var lib = path.join(path.dirname(fs.realpathSync(__filename)), '../lib');
var Game = require(lib + '/game.js');
var Board = require(lib + '/board.js');
var StringRenderer = require(lib + '/string_renderer');
var Ticker = require(lib + '/ticker.js');

program
	.version('0.0.0')
	.option('-w, --width <width>', 
		'specify the width of the grid', parseInt, -1)
	.option('-h, --height <height>', 
		'specify the height of the grid', parseInt, -1)
	.option('-c, --config <path>', 'specify the config file to read from',
		'../examples/blinker.json')
	.parse(process.argv);
program.config = path.resolve(path.dirname(fs.realpathSync(__filename)), program.config);
var json = fs.readFileSync(program.config, { encoding: 'utf-8' });
var configData = JSON.parse(json);

var board = new Board(configData.width, configData.height);
configData.liveCells.forEach(function(liveCell) {
	board.setCell(liveCell[0], liveCell[1], true);
});
var game = new Game(board);
var boardRenderer = new StringRenderer();

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

var ticker = new Ticker(250, function onTick() {
	game.tick();
	box.setContent(boardRenderer.render(game.board));
	screen.render();
});

box.setContent(boardRenderer.render(board));

// Append our box to the screen.
screen.append(box);

screen.key(['space'], function(ch, key) {
	if (!ticker.running) {
		game.tick();
		box.setContent(boardRenderer.render(game.board));
		screen.render();
	}
});

screen.key(['enter'], function(ch, key) {
	ticker.toggle();
});

// Quit on Escape, q, or Control-C.
screen.key(['escape', 'q', 'C-c'], function(ch, key) {
  return process.exit(0);
});

// Focus our element.
box.focus();

// Render the screen.
screen.render();