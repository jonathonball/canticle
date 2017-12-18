#!/usr/bin/env node
const youtube = require('youtube-dl');
const mplayer = require('mplayer');
const blessed = require('blessed');
var config = require('config');
var playlists = config.get('playlists');

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
var messageBar = blessed.box({
    parent: screen,
    name: 'messageBar',
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

var playlistManager = blessed.list({
    name: 'playlistManager',
    top: 0,
    right: 0,
    width: '50%',
    height: '50%',
    content: 'playlistManager goes here',
    tags: true,
    border: {
        type: 'line'
    },
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

var alertBox = blessed.box({
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

function quitConfirmVisible() {
    return screen.children.filter(({name}) => name == 'quit_confirm').length >= 1;
}

function resetAlertBox() {
    screen.log('tried to resetAlertBox');
    alertBox.name = 'alertBox';
    alertBox.content = '';
    alertBox.detach();
    screen.render();
}

function showAlertBox(name, message) {
    alertBox.name = name;
    alertBox.content = message;
    screen.append(alertBox);
    alertBox.focus();
    screen.render();
}

// Quit on Escape, q, or Control-C.
screen.key(['escape', 'q'], function(ch, key) {
    if (quitConfirmVisible() && key.name == 'escape') {
        resetAlertBox();
    } else if (!quitConfirmVisible()) {
        showAlertBox('quit_confirm', "{center}  Quit Canticle?\n  Y or y to quit{/center}");
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
    /*
    let playlists = config.get('playlists');
    playlists.forEach(function(playlist) {
        playlist.tracks.forEach(function(track) {
            screen.log(track.title);
        });
    });
    */
});

playlistManager.on('attach', function() {
    screen.log('plm was attached to screen');

    screen.render();
});


screen.render();
screen.append(playlistManager);
