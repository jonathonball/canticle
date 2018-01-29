const UserInterface = require('./lib/user_interface');
const Storage = require('./lib/storage');

var storage = new Storage();

storage.on('ready', (playlists) => {
    var userInterface = new UserInterface();

    userInterface.playlistManager.addPlaylists(playlists);

    userInterface.on('shutdown', () => {
        console.log('Goodbye!');
    });
});
