const UserInterface = require('./lib/user_interface');
const Storage = require('./lib/storage');
const yargs = require('yargs')
                .option('playlist', {
                    alias: 'p',
                    describe: 'Playlist to load',
                    type: 'string',
                    nargs: 1
                })
                .option('autoplay', {
                    alias: 'a',
                    describe: 'Automatically start playback',
                    type: 'boolean'
                })
                .help('h')
                .alias('h', 'help')
                .argv;

var storage = new Storage(yargs);

storage.on('ready', (initialPlaylists) => {
    var userInterface = new UserInterface(storage);

    storage.on('log', (message) => {
        userInterface.screen.log(message);
    });

    userInterface.on('shutdown', () => {
        console.log('Goodbye!');
    });

    process.on(['exit', 'SIGINT', 'SIGUSR1', 'SIGUSR2', 'uncaughtException'], () => {
        userInterface.shutdown();
    });

    userInterface.processAutoloads();
});
