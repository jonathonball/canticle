#!/usr/bin/env node
process.name = 'canticle';

const Canticle = require('./lib/canticle');
const YoutubeInfoGather = require('./lib/youtube-canticle');
const CommandTranslator = require('./lib/command-translation');
const config = require('config');

const canticle = new Canticle();
const youtube = new YoutubeInfoGather();
const translate = new CommandTranslator();

var playlists = config.get('playlists');

canticle.on('playlistManagerConsole', (userInput) => {
    let translatedCmd = translate.findCommand(userInput.cmd);
    switch (translatedCmd) {
        case 'add':
            canticle.playlistManagerAddItem(userInput.params);
            break;
        case 'delete':
            canticle.playlistManagerRemoveItem(userInput.params);
            break;
        default:
            canticle.playlistManagerLog.log(userInput.cmd + " command unknown");
    }
});
