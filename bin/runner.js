#!/usr/bin/env node
'use strict';

var program = require('commander');
var blessed = require('blessed');
var fs = require('fs');
var path = require('path');
var lib = path.join(path.dirname(fs.realpathSync(__filename)), '../lib');
var Ticker = require(lib + '/ticker.js');
var App = require(lib + '/app.js');

program._name = 'blessed-life';
program
	.option('--width <width>', 
		'specify the width of the grid', parseInt)
	.option('--height <height>', 
		'specify the height of the grid', parseInt)
	.option('--livecell <ch>', 'specify the char to use for live cells')
	.option('--deadcell <ch>', 'specify the char to use for dead cells')
	.option('--speed <speed>', 'specify the speed in milliseconds for each tick')
	.option('-c, --config <path>', 'specify the config file to read from')
	.option('-a, --autostart', 
		'whether or not to automatically start the simulation')
	.option('--fg <color>', 'specify the foreground color of the simulation.')
	.option('--bg <color>', 'specify the background color of the simulation.')
	.parse(process.argv);
var configFile = {};
if (program.config) {
	program.config = path.resolve(program.config);
	var json = fs.readFileSync(program.config, { encoding: 'utf-8' });
	configFile = JSON.parse(json);
}
var config = {
	width: (!isNaN(program.width) ? program.width : configFile.width || 0),
	height: (!isNaN(program.height) ? program.height : configFile.height || 0),
	liveCell: program.livecell || configFile.liveCell || '█',
	deadCell: program.deadcell || configFile.deadCell || ' ',
	speed: program.speed || configFile.speed || 250,
	fg: program.fg || configFile.fg || 'white',
	bg: program.bg || configFile.bg || 'black',
	liveCells: configFile.liveCells || []
};

var screen = blessed.screen();

config.width = config.width || screen.width;
config.height = config.height || screen.height;

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
    fg: config.fg,
    bg: config.bg
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

var ticker = new Ticker(config.speed, onTick);
if (program.autostart) {
	ticker.start();
}

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