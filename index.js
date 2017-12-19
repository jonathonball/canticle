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
var userAction = true;

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
var loading = blessed.box(screen.templates.loading);

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
    userAction = true;
    screen.append(playlist);
    playlistManager.disable();
    screen.render();
});

playlist.on('attach', function() {
    selectedTrack = 0;
    let incomingPlaylist = playlists[selectedPlaylist];
    playlist.addItem('Loading...');
    screen.append(loading);
    playlist.getRealYoutubeUrl(incomingPlaylist.tracks[selectedTrack]).then(function(streamData) {
        playlist.clearItems();
        loading.detach();
        player.openFile(streamData.realUrl);
        playlist.attachPlaylist(incomingPlaylist);
        screen.render();
        userAction = false;
    }, function(err) {
        throw err;
    });
});

playlist.on('select', function(unknown, index) {
    userAction = true;
    player.stop();
    screen.append(loading);
    playlist.getRealYoutubeUrl(playlists[selectedPlaylist].tracks[index]).then(function(streamData) {
        loading.detach();
        player.openFile(streamData.realUrl);
        screen.render();
        userAction = false;
    }, function (err) {
        throw err;
    });
});

player.on('stop', function(unknown){
    if (userAction) {
        console.log('playback ended because of user actions');
    } else {
        console.log('playback ended naturally');
    }
    screen.render();
});
screen.append(messageBar);
screen.append(playlistManager);
screen.render();
