#!/usr/bin/env node
const youtube = require('youtube-dl');
const MPlayer = require('mplayer');
const blessed = require('blessed');
var config = require('config');
var playlists = config.get('playlists');
var selectedPlaylist = 0;
var selectedTrack = 0;
var player = new MPlayer();

process.name = 'Canticle';

var screen = blessed.screen({
  smartCSR: true,
  log: process.env.HOME + '/blessed-terminal.log',
  fullUnicode: true,
  dockBorders: true,
  ignoreDockContrast: true
});

screen.title = 'Canticle';

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
    top: 1,
    right: 1,
    width: '50%',
    height: '50%',
    interactive: true,
    border: {
        type: 'line'
    },
    selectedBg: 'red',
    mouse: true,
    keys: true
});

var playlist = blessed.list({
    name: 'playlist',
    top: 0,
    right: 0,
    width: '50%',
    height: '50%',
    interactive: true,
    border: {
        type: 'line'
    },
    selectedBg: 'red',
    mouse: true,
    keys: true
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

function playlistVisible() {
    return screen.children.filter(({name}) => name == 'playlist').length >= 1;
}

function resetAlertBox() {
    alertBox.name = 'alertBox';
    alertBox.content = '';
    alertBox.detach();
    screen.render();
}

function resetPlaylist() {
    playlist.clearItems();
    playlist.detach();
    playlistManager.focus();
    screen.render();
}

function showAlertBox(name, message) {
    alertBox.name = name;
    alertBox.content = message;
    screen.append(alertBox);
    alertBox.focus();
    screen.render();
}

screen.key(['escape', 'q'], function(ch, key) {
    if (quitConfirmVisible() && key.name == 'escape') {
        resetAlertBox();
        return;
    }
    if ( ! quitConfirmVisible()) {
        showAlertBox('quit_confirm', "{center}  Quit Canticle?\n  Y or y to quit{/center}");
    }
});

screen.key(['Y', 'y'], function(ch, key) {
    if (quitConfirmVisible()) {
        screen.destroy();
        player.stop();
        process.exit(0);
    }
});

screen.key(['C-c'], function(ch, key) {
    return process.exit(0);
});

screen.key(['P', 'p'], function(ch, key) {
    if (playlistVisible()) {
        resetPlaylist();
    }
});

screen.key(['space'], function(ch, key) {
    let track = playlists[selectedPlaylist].tracks[selectedTrack];
    youtube.getInfo([track.url], function(err, info) {
        if (err) throw err;
    	let audioStreams = info.formats.filter(({vcodec}) => vcodec == 'none');
    	console.log('found ' + audioStreams.length + ' audio streams');
    	player.openFile(audioStreams[0].url);
    	player.play();
    });

});

playlistManager.on('attach', function() {
    playlists.forEach(function(playlist) {
        playlistManager.add(playlist.name);
    });
    playlistManager.focus();
    screen.render();
});

playlistManager.on('select', function(unknown, index) {
    let playlistName = playlists[index].name;
    selectedPlaylist = index;
    screen.append(playlist);
});

playlist.on('attach', function() {
    playlists[selectedPlaylist].tracks.forEach(function(track) {
        playlist.add(track.title);
    });
    playlist.focus();
    screen.render();
});

playlist.on('select', function(unknown, index) {
    selectedTrack = index;
    messageBar.content = playlists[selectedPlaylist].tracks[selectedTrack].title;
    player.pause();
    screen.render();
});

screen.render();
screen.append(playlistManager);
