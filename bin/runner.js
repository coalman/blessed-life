#!/usr/bin/env node
'use strict';

var program = require('commander');
var blessed = require('blessed');
var fs = require('fs');
var path = require('path');
var lib = path.join(path.dirname(fs.realpathSync(__filename)), '../lib');
var Ticker = require(lib + '/ticker.js');
var App = require(lib + '/app.js');

process.argv[1] = 'blessed-life';
program
	.option('--width <width>', 
		'specify the width of the grid', parseInt, 0)
	.option('--height <height>', 
		'specify the height of the grid', parseInt, 0)
	.option('--livecell <ch>', 'specify the char to use for live cells')
	.option('--deadcell <ch>', 'specify the char to use for dead cells')
	.option('-c, --config <path>', 'specify the config file to read from')
	.parse(process.argv);
var config = {
	width: program.width,
	height: program.height,
	liveCell: program.livecell,
	deadCell: program.deadcell,
	liveCells: []
};

if (program.config) {
	program.config = path.resolve(program.config);
	var json = fs.readFileSync(program.config, { encoding: 'utf-8' });
	var configData = JSON.parse(json);

	config.width = configData.width;
	config.height = configData.height;
	if (!config.liveCell) {
		config.liveCell = configData.liveCell;
	}
	if (!config.deadCell) {
		config.deadCell = configData.deadCell;
	}
	config.liveCells = configData.liveCells;
}
if (!config.liveCell) {
	config.liveCell = '0';
}
if (!config.deadCell) {
	config.deadCell = ' ';
}

var screen = blessed.screen();

if (config.width === 0) {
	config.width = screen.width;
}
if (config.height === 0) {
	config.height = screen.height;
}

var app = new App(config);

// Create ui components
var box = blessed.box({
  top: '0',
  left: '0',
  width: '100%',
  height: '100%',
  content: app.renderBoard(),
  tags: true,
  style: {
    fg: 'white',
    bg: 'black'
  }
});
screen.append(box);

var spawnForm = blessed.form({
	left: 0,
	bottom: 0,
	width: '100%',
	height: 1,
	content: "Toggle Position? ",
	hidden: true
});
screen.append(spawnForm);

var spawnInput = blessed.textbox({
	left: spawnForm.content.length,
	bottom: 0,
	width: screen.width - spawnForm.content.length,
	height: 1,
	hidden: true
});
spawnForm.append(spawnInput);
// finished creating ui components

function onTick() {
	app.tick();
	box.setContent(app.renderBoard());
	screen.render();
}

var ticker = new Ticker(250, onTick);

screen.key(['space'], function(ch, key) {
	if (!ticker.running) {
		onTick();
	}
});

screen.key(['p'], function(ch, key) {
	ticker.toggle();
});

screen.key(['i'], function(ch, key) {
	if (ticker.running) {
		ticker.stop();
	}

	spawnForm.show();
	spawnInput.show();
	spawnInput.readInput(function onDone(err, value) {
		spawnForm.hide();
		spawnInput.hide();
		spawnInput.setValue('');

		value = value.split(',');
		var x = parseInt(value[0]);
		var y = parseInt(value[1]);
		if (app.game.board.isInBounds(x, y)) {
			app.game.board.toggleCell(x, y);
			box.setContent(app.renderBoard());
		}

		screen.render();
	});
	screen.render();
});

screen.key(['escape', 'q', 'C-c'], function(ch, key) {
  return process.exit(0);
});

screen.render();