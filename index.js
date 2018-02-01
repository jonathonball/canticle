const UserInterface = require('./lib/user_interface');
const Storage = require('./lib/storage');

var storage = new Storage();

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

    userInterface.playlistManager.addPlaylists(initialPlaylists);
});
