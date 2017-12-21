#!/usr/bin/env node
process.name = 'canticle';

const Canticle = require('./lib/canticle');

const canticle = new Canticle();

/*
const blessed = require('./lib/blessed-canticle');
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
var debug = blessed.box(screen.templates.debug);

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
        player.openFile(streamData.realUrl);
        playlist.attachPlaylist(incomingPlaylist);
        loading.detach();
        screen.render();
        userAction = false;
    }, function(err) {
        throw err;
    });
});

playlist.on('select', function(unknown, index) {
    userAction = true;
    selectedTrack = index;
    playlist.disable();
    player.stop();
    screen.append(loading);
    playlist.getRealYoutubeUrl(playlists[selectedPlaylist].tracks[index]).then(function(streamData) {
        player.openFile(streamData.realUrl);
        userAction = false;
        playlist.enable();
        playlist.select(index);
        loading.detach();
        screen.render();
    }, function (err) {
        throw err;
    });
});

player.on('stop', function(unknown){
    if (userAction) {
        console.log('playback ended because of user actions');
    } else {
        console.log('playback ended naturally');
        selectedTrack++;
        if (selectedTrack >= playlists[selectedPlaylist].tracks.length) {
            selectedTrack = 0;
        }
        playlist.disable();
        screen.append(loading);
        playlist.getRealYoutubeUrl(playlists[selectedPlaylist].tracks[selectedTrack]).then(function(streamData) {
            player.openFile(streamData.realUrl);
            playlist.enable();
            playlist.select(selectedTrack);
            loading.detach();
            screen.render();
        }, function(err) {
            throw err;
        });
    }
    screen.render();
});

//screen.append(debug);
screen.append(messageBar);
screen.append(playlistManager);
//screen.append(playlistManagerControls);
//playlistManager.append(playlistManagerControls);
//playlistManagerControls.append(createPlaylistButton);
screen.render();
*/
