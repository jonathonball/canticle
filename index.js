#!/usr/bin/env node
process.name = 'canticle';

const blessed = require('./lib/blessed-canticle');
const youtube = require('youtube-dl');
const MPlayer = require('mplayer');
const config = require('config');

var playlists = config.get('playlists');
var selectedPlaylist = 0;
var selectedTrack = 0;
var player = new MPlayer();

var screen = blessed.screen({
  smartCSR: true,
  log: process.env.HOME + '/blessed-terminal.log',
  fullUnicode: true,
  dockBorders: true,
  ignoreDockContrast: true,
  debug: config.get('debug')
});

screen.title = 'canticle';

var messageBar = blessed.box(screen.templates.messageBar);
var playlistManager = blessed.list(screen.templates.playlistManager);
var playlist = blessed.list(screen.templates.playlist);

screen.key(['C-c'], (ch, key) => {
    screen.destroy();
    console.log('goodbye');
    player.player.cmd('quit');
    process.exit(0);
});

screen.key(['R', 'r'], (ch, key) => {
    screen.render();
});

screen.key(['P', 'p'], function(ch, key) { });

playlistManager.on('attach', function() {
    playlistManager.attachPlaylistManager(playlists);
});

playlistManager.on('select', function(unknown, index) {
    selectedPlaylist = index;
    screen.append(playlist);
    playlistManager.disable();
    screen.render();
});

playlist.on('attach', function() {
    selectedTrack = 0;
    playlist.attachPlaylist(playlists[selectedPlaylist]);

});


screen.append(messageBar);
screen.append(playlistManager);
screen.render();
