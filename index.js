#!/usr/bin/env node
process.name = 'canticle';

const ResourceResolver = require('./lib/resource-resolver');
const resources = new ResourceResolver();
const CommandTranslator = require('./lib/command-translation');
const translate = new CommandTranslator();
const Storage = require('./lib/storage');
const storage = new Storage();
const Canticle = require('./lib/canticle');
const canticle = new Canticle(storage.config.blessedLogFullPath);
const MPlayer = require('./lib/mplayer');
const mplayer = new MPlayer();

function shutdown() {
    canticle.screen.destroy();
    mplayer.quit();
    console.log('Goodbye!');
    process.exit(0);
}

function playlistCommands(command) {
    switch (command.verb.name) {
        case 'add':
            storage.addPlaylist(command.params);
            break;
        case 'delete':
            storage.deletePlaylist(command.params);
            break;
        case 'close':
            shutdown();
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
            resources.getInfo(command.params, 'get_info_add');
            break;
        case 'delete':
        case 'close':
        case 'open':
        default:
            canticle.log.log('Track command "' + command.raw + '" was not understood.');
    }
}

/**
 * Returning user's input from the console
 */
canticle.on('console_input', (userInput) => {
    let translatedCmd = translate.parseConsoleInput(userInput);
    // Check for uninary commands
    if (translatedCmd.verb.name == 'close') {
        shutdown();
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
            canticle.log.log('Command was not understood.');
    }
    canticle.screen.render();
});

/**
 * Returning the name of a playlist that was added
 */
storage.on('playlist_add', (playlistName) => {
    canticle.playlistManagerAddItem(playlistName);
});

/**
 * Returning the name of a deleted playlist
 */
storage.on('playlist_delete', (playlistName) => {
    canticle.playlistManagerRemoveItem(playlistName);
});

/**
 * Returning a list of playlists for app startup
 */
storage.on('get_playlists', (playlists) => {
    playlists.forEach((playlist) => {
        canticle.playlistManagerAddItem(playlist.name, { backend: true });
    });
});

/**
 * Returning a playlist that was opened
 */
storage.on('get_playlist', (playlist) => {
    canticle.openPlaylist(playlist);
});

/**
 * Returning a newly created track
 */
storage.on('add_track', (track) => {
    canticle.playlistAddItem(track);
});

storage.on('storage_log', (msg) => {
    canticle.screen.log(msg);
});

/**
 * Returning info for adding a new track
 */
resources.on('get_info_add', (info) => {
    storage.addTrack(canticle.loadedPlaylist, info);
});

canticle.on('start_playback', (track) => {
    canticle.log.log('Starting playback for ' + track.title);
    canticle.screen.log(track);
});

/**
 * Returns a user request to shutdown
 */
canticle.on('shutdown', () => {
    shutdown();
});

/**
 * Application is closing.  Make one last attempt to kill mplayer
 */
process.on(['exit', 'SIGINT', 'SIGUSR1', 'SIGUSR2', 'uncaughtException'], () => {
    mplayer.quit()
});

/**
 * Everything is loaded, prep user interface
 */
storage.getPlaylists();
canticle.commandConsoleInput.focus();
canticle.screen.render();
