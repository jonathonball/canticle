#!/usr/bin/env node
process.name = 'canticle';

const YoutubeInfoGather = require('./lib/youtube-canticle');
const youtube = new YoutubeInfoGather();
const CommandTranslator = require('./lib/command-translation');
const translate = new CommandTranslator();
const Storage = require('./lib/storage');
const storage = new Storage();
const Canticle = require('./lib/canticle');
const canticle = new Canticle(storage.config.blessedLogFullPath);

canticle.on('playlistManagerConsole', (userInput) => {
    let translatedCmd = translate.findCommand(userInput.cmd);
    switch (translatedCmd) {
        case 'add':
            storage.addPlaylist(userInput.params);
            break;
        case 'delete':
            storage.deletePlaylist(userInput.params);
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

storage.on('playlist_delete', (playlistName) => {
    if (playlistName.hasOwnProperty('failure')) {
        canticle.plmLog.log('err removing ' + playlistName.playlistName);
    } else {
        canticle.playlistManagerRemoveItem(playlistName);
    }
});

storage.on('get_playlists', (playlists) => {
    playlists.forEach((playlist) => {
        canticle.playlistManagerAddItem(playlist.name);
    });
});

storage.on('storage_log', (msg) => {
    canticle.screen.log(msg);
});

storage.getPlaylists();
