#!/usr/bin/env node
const youtube = require('youtube-dl');
const mplayer = require('mplayer');
const blessed = require('blessed');
process.name = 'Canticle';

var screen = blessed.screen({
  smartCSR: true,
  log: process.env.HOME + '/blessed-terminal.log',
  fullUnicode: true,
  dockBorders: true,
  ignoreDockContrast: true
});

screen.title = 'Canticle';

// Create a box perfectly centered horizontally and vertically.
var message_bar = blessed.box({
  parent: screen,
  name: 'message_bar',
  bottom: 0,
  left: 'center',
  width: '100%',
  height: 'shrink',
  content: 'Hello {bold}world{/bold}!',
  tags: true,
  style: {
    fg: 'white',
    bg: 'black',
    border: {
      fg: '#f0f0f0'
    },
    hover: {
      bg: 'green'
    }
  }
});

var alert_box = blessed.box({
    name: null,
	top: 'center',
	left: 'center',
	width: 25,
	height: 'shrink',
	tags: true,
    border: {
		type: 'line'
	},
	style: {
		fg: 'white',
		bg: 'black',
		border: {
			fg: 'white'
		}
	}
});
//quitbox.name = 'test';
//screen.append(box);

function quitConfirmVisible() {
    return screen.children.filter(({name}) => name == 'quit_confirm').length >= 1;
}

// Quit on Escape, q, or Control-C.
screen.key(['escape', 'q'], function(ch, key) {
  screen.log('user tried to escape');
  if (! quitConfirmVisible()) {
      alert_box.name = 'quit_confirm';
      alert_box.content = "{center}Quit Canticle?{/}";
      screen.append(alert_box);
      alert_box.focus();
      screen.render();
  }
});

screen.key(['Y', 'y'], function(ch, key) {
    if (quitConfirmVisible()) {
        screen.destroy();
    }
});

// Quit on Escape, q, or Control-C.
screen.key(['C-c'], function(ch, key) {
  return process.exit(0);
});

screen.key('enter', function(ch, key) {
	screen.log('user pressed enter');
	screen.children.forEach(function(child) {
		screen.log(child.name);
	});
});

screen.render();
