#!/usr/bin/env node
process.name = 'canticle';

const ResourceResolver = require('./lib/resource-resolver');
const resolver = new ResourceResolver();
const CommandTranslator = require('./lib/command-translation');
const translate = new CommandTranslator();
const Storage = require('./lib/storage');
const storage = new Storage();
const Canticle = require('./lib/canticle');
const canticle = new Canticle(storage.config.blessedLogFullPath);

function playlistCommands(command) {
    switch (command.verb.name) {
        case 'add':
            storage.addPlaylist(command.params);
            break;
        case 'delete':
            storage.deletePlaylist(command.params);
            break;
        case 'close':
            canticle.gtfo();
            break;
        case 'open':
            storage.getPlaylist(command.params);
            break;
        default:
            canticle.log.log('Playlist command "' + command.raw + '" was not understood.');
    }
}

function trackCommands(command) {
    switch(command.verb.name) {
        case 'add':
        case 'delete':
        case 'close':
        case 'open':
        default:
            canticle.log.log('Track command "' + command.raw + '" was not understood.');
    }
}

canticle.on('console_input', (userInput) => {
    let translatedCmd = translate.parseConsoleInput(userInput);
    // Check for uninary commands
    if (translatedCmd.verb.name == 'close') {
        canticle.gtfo();
    }
    // Check for fully qualified commands
    switch (translatedCmd.noun.name) {
        case 'playlist':
            playlistCommands(translatedCmd);
            break;
        case 'track':
            trackCommands(translatedCmd);
            break;
        default:
            canticle.log.log('Command "' + command.raw + '" was not understood.');
    }
    canticle.screen.render();
});

storage.on('playlist_add', (playlistName) => {
    canticle.playlistManagerAddItem(playlistName);
});

storage.on('playlist_delete', (playlistName) => {
    canticle.playlistManagerRemoveItem(playlistName);
});

storage.on('get_playlists', (playlists) => {
    playlists.forEach((playlist) => {
        canticle.playlistManagerAddItem(playlist.name, { backend: true });
    });
});

storage.on('get_playlist', (playlist) => {
    canticle.openPlaylist(playlist);
});

storage.on('storage_log', (msg) => {
    canticle.screen.log(msg);
});

storage.getPlaylists();
canticle.commandConsoleInput.focus();
canticle.screen.render();
