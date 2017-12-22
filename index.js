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
            canticle.screen.log('user adding');
            // TODO validate params
            canticle.playlistManagerList.addItem(userInput.params);
            canticle.screen.render();
            break;
        case 'delete':
            break;
        default:
            canticle.playlistManagerLog.log(userInput.cmd + " command unknown");
    }
});
