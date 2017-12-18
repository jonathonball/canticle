#!/usr/bin/env node
const youtube = require('youtube-dl');
const MPlayer = require('mplayer');
const blessed = require('blessed');
var config = require('config');
var playlists = config.get('playlists');
var player = new MPlayer();
var selectedPlaylist = 0;
var selectedTrack = 0;

var playerStatus = {};

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

var loadingBox = blessed.box({
    name: 'loadingBox',
    bottom: 3,
    left: 0,
    width: '25%',
    height: 'shrink',
    content: "Loading..",
    border: {
        type: 'line'
    },
    style: {
        fg: 'orange',
        bg: 'black',
        border: {
            fg: 'green'
        }
    }
});

function childIsVisible(childName) {
    return screen.children.filter(({name}) => name == childName).length >= 1;
}

function showLoadingBox() {
    if (! childIsVisible('loadingBox')) {
        screen.append(loadingBox);
        screen.render();
    }
}

function resetLoadingBox() {
    if (childIsVisible('loadingBox')) {
        loadingBox.detach();
    }
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

/*
function setPlayerTrack() {
    let track = playlists[selectedPlaylist].tracks[selectedTrack];
    console.log(track.title);
    console.log(track.url);
    youtube.getInfo([track.url], function(err, info) {
        if (err) throw err;
        let audioStreams = info.formats.filter(({vcodec}) => vcodec == 'none');
        console.log('found ' + audioStreams.length + ' audio streams');
        console.log(audioStreams[0].url);

        messageBar.content = playlists[selectedPlaylist].tracks[selectedTrack].title;
        screen.render();
    });
}
*/
screen.key(['escape', 'q'], function(ch, key) {
    if (childIsVisible('quit_confirm') && key.name == 'escape') {
        resetAlertBox();
        return;
    }
    if ( ! childIsVisible('quit_confirm')) {
        showAlertBox('quit_confirm', "{center}  Quit Canticle?\n  Y or y to quit{/center}");
    }
});

screen.key(['Y', 'y'], function(ch, key) {
    if (childIsVisible('quit_confirm')) {
        screen.destroy();
        process.exit(0);
    }
});

screen.key(['C-c'], function(ch, key) {
    return process.exit(0);
});

screen.key(['P', 'p'], function(ch, key) {
    if (childIsVisible('playlist')) {
        resetPlaylist();
    }
});

screen.key(['space'], function(ch, key) {

});

playlistManager.on('attach', function() {
    playlists.forEach(function(playlist) {
        playlistManager.add(playlist.name);
    });
    playlistManager.focus();
    screen.render();
});

playlistManager.on('select', function(unknown, index) {
    selectedPlaylist = index;
    selectedTrack = 0;
    let playlistName = playlists[index].name;
    screen.log('playlistManager: user selected playlist titled ' + playlistName);
    screen.append(playlist);
});

playlist.on('attach', function() {
    playlists[selectedPlaylist].tracks.forEach(function(track) {
        playlist.add(track.title);
    });
    playlist.select(selectedTrack);
    playlist.focus();
    screen.render();
});

playlist.on('select', function(unknown, index) {
    screen.log
});

screen.render();
screen.append(playlistManager);
