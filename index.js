#!/usr/bin/env node
const youtube = require('youtube-dl');
const MPlayer = require('mplayer');
const blessed = require('blessed');
var config = require('config');
var playlists = config.get('playlists');
var player = new MPlayer();
var selectedPlaylist = 0;
var selectedTrack = 0;
var selectedTrackDuration = 0;
var playerStatus = {};
var nextTrack = null;
var playerHardStop = false;

player.setOptions({
    debug: true,
});
process.name = 'canticle';

var screen = blessed.screen({
  smartCSR: true,
  log: process.env.HOME + '/blessed-terminal.log',
  fullUnicode: true,
  dockBorders: true,
  ignoreDockContrast: true
});

screen.title = 'canticle';

var messageBar = blessed.box({
    parent: screen,
    name: 'messageBar',
    bottom: 0,
    left: 'center',
    width: '100%',
    height: 'shrink',
    align: 'center',
    content: 'Welcome to canticle',
    tags: true,
    style: {
        fg: '#ffffff',
        bg: '#000000',
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
    bg: '#000000',
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

/**
 * @param string childName
 * @return boolean
 */
var childIsVisible = (childName) => screen.children.filter(({name}) => name == childName).length >= 1;

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

function fmtMSS(s) {
    return (s-(s%=60))/60+(9<s?':':':0')+s
}

function setPlayerTrack() {
    console.log('entered setPlayerTrack');
    screen.append(loadingBox);
    screen.render();
    let track = playlists[selectedPlaylist].tracks[selectedTrack];
    youtube.getInfo([track.url], function(err, info) {
        if (err) throw err;
        let audioStreams = info.formats.filter(({vcodec}) => vcodec == 'none');
        player.openFile(audioStreams[0].url);
        messageBar.content = playlists[selectedPlaylist].tracks[selectedTrack].title;
        selectedTrackDuration = info.duration;
        playlist.select(selectedTrack);
        loadingBox.detach();
        if (audioStreams[0].url) {
            console.log(audioStreams[0].url);
        } else {
            console.log('failed to load url for song');
        }
        screen.render();
    });
}

screen.key(['escape', 'q'], function(ch, key) {
    if (childIsVisible('quit_confirm') && key.name == 'escape') {
        resetAlertBox();
        return;
    }
    if ( ! childIsVisible('quit_confirm')) {
        showAlertBox('quit_confirm', "{center}  Quit canticle?\n  Y or y to quit{/center}");
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
    if (playerStatus.playing) {
        player.pause();
    } else {
        player.play();
    }
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
    let playlistName = playlists[index].name;
    screen.log('playlistManager: user selected playlist titled ' + playlistName);
    screen.append(playlist);
});

playlist.on('attach', function() {
    playlists[selectedPlaylist].tracks.forEach(function(track) {
        playlist.add(track.title);
    });
    selectedTrack = 0;
    playerHardStop = true;
    player.stop();
    playlist.select(0);
    playlist.focus();
    
    screen.render();
});

playlist.on('select', function(unknown, index) {
    nextTrack = index;
    playerHardStop = true;
    setPlayerTrack();
});

player.on('status', function(info) {
    playerStatus = info;
    //console.log(info);
});

player.on('stop', function(exitCode) {
    if (! playerHardStop) {
        if (nextTrack !== null) {
            selectedTrack = nextTrack;
        } else {
            selectedTrack++;
            if (selectedTrack >= playlists[selectedPlaylist].tracks.length) {
                selectedTrack = 0;
            }
        }
        setPlayerTrack();
        nextTrack = null;
    } else {
        playerHardStop = false;
    }
});

player.on('time', function(timeIndex) {
    if (playerStatus.playing && parseInt(timeIndex) == timeIndex) {
        messageBar.content = playlists[selectedPlaylist].tracks[selectedTrack].title + " [" + fmtMSS(parseInt(timeIndex)) + "/" + selectedTrackDuration + "]";
        screen.render();
    }
});

player.on('error', function(e) {
    screen.log(e);
    proceess.exit(1);
});

screen.render();
screen.append(playlistManager);
