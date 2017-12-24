#!/usr/bin/env node
process.name = 'canticle';

const YoutubeInfoGather = require('./lib/youtube-canticle');
const CommandTranslator = require('./lib/command-translation');
const youtube = new YoutubeInfoGather();
const translate = new CommandTranslator();

const Storage = require('./lib/storage');
const storage = new Storage();

const Canticle = require('./lib/canticle');
const canticle = new Canticle();

canticle.on('playlistManagerConsole', (userInput) => {
    let translatedCmd = translate.findCommand(userInput.cmd);
    switch (translatedCmd) {
        case 'add':
            storage.addPlaylist(userInput.params);
            break;
        case 'delete':
            canticle.playlistManagerRemoveItem(userInput.params);
            break;
        default:
            canticle.plmLog.log(userInput.cmd + " command unknown");
    }
});

storage.on('playlist_add', (playlistName) => {
    if (playlistName.hasOwnProperty('failure')) {
        canticle.plmLog.log('error adding ' + playlistName.playlistName);
    } else {
        canticle.playlistManagerAddItem(playlistName);
    }
});
