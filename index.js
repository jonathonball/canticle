#!/usr/bin/env node
process.name = 'canticle';

const YoutubeInfoGather = require('./lib/youtube-canticle');
const CommandTranslator = require('./lib/command-translation');
const Storage = require('./lib/storage');
const storage = new Storage();
const Canticle = require('./lib/canticle');
const canticle = new Canticle();
const youtube = new YoutubeInfoGather();
const translate = new CommandTranslator();



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
            canticle.plmLog.log(userInput.cmd + " command unknown");
    }
});
