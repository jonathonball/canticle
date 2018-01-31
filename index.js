const UserInterface = require('./lib/user_interface');
const Storage = require('./lib/storage');

var storage = new Storage();

storage.on('ready', (initialPlaylists) => {
    var userInterface = new UserInterface(storage);

    userInterface.on('quit', () => {
        console.log('Goodbye!');
    });

    userInterface.playlistManager.addPlaylists(initialPlaylists);
});
