#!/usr/bin/env node
process.name = 'canticle';

const blessed = require('./lib/blessed-canticle');
const youtube = require('youtube-dl');
const MPlayer = require('mplayer');
const config = require('config');
const widgets = require('./lib/widgets');

var playlists = config.get('playlists');

var screen = blessed.screen({
  smartCSR: true,
  log: process.env.HOME + '/blessed-terminal.log',
  fullUnicode: true,
  dockBorders: true,
  ignoreDockContrast: true,
  debug: true
});

screen.title = 'canticle';

var messageBar = blessed.box(widgets.messageBar);
var playlistManager = blessed.list(widgets.playlistManager);
var playlist = blessed.list(widgets.playlist);

screen.key(['C-c'], (ch, key) => {
    screen.destroy();
    process.exit(0);
});

screen.key(['R', 'r'], (ch, key) => {
    screen.render();
});

screen.key(['P', 'p'], function(ch, key) { });

playlistManager.on('attach', function() {
    if (playlists.length) {
        screen.log('Found playlists in config, adding to playlist manager');
        playlists.forEach(function(playlist) {
            screen.log('Adding playlist named ' + playlist.name);
            playlistManager.addItem(playlist.name);
        });
        playlistManager.enable();
    } else {
        playlistManager.addItem('No playlists found');
        playlistManager.interactive = false;
    }
    playlistManager.select(0);
    playlistManager.focus();
});

screen.append(messageBar);
screen.append(playlistManager);

screen.render();
