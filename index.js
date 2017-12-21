#!/usr/bin/env node
process.name = 'canticle';

const Canticle = require('./lib/canticle');
const YoutubeInfoGather = require('./lib/youtube-canticle');
const config = require('config');

const canticle = new Canticle();
const youtube = new YoutubeInfoGather();

var playlists = config.get('playlists');

canticle.on('playlistManagerConsole', (userInput) => {
    switch (userInput.cmd) {
        case 'add':
        case 'insert':
        case 'create':
        case '+':
            canticle.screen.log('user adding');
            // TODO validate params
            canticle.playlistManagerList.addItem(userInput.params);
            canticle.screen.render();
            break;
        default:
            canticle.playlistManagerLog.log(userInput.cmd + " command unknown");
    }
});
