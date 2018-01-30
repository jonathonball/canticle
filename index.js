const UserInterface = require('./lib/user_interface');
const Storage = require('./lib/storage');

var storage = new Storage();

storage.on('ready', (playlists) => {
    var userInterface = new UserInterface();
    userInterface.log.log('Welcome to Canticle.');
    userInterface.playlistManager.addPlaylists(playlists);

    userInterface.on('command_add_playlist', (name) => {
        let addPlaylistQuery = storage.Playlist.create({ name: name });
        userInterface.playlistManager.addPlaylist(addPlaylistQuery);
    });

    userInterface.on('command_delete_playlist', (name) => {
        let deletePlaylistQuery = storage.Playlist.destroy({ where: { name: name } });
        userInterface.playlistManager.deletePlaylist(deletePlaylistQuery, name);
    });

    userInterface.on('command_close', () => {
        userInterface.screen.destroy();
        console.log('Goodbye!');
    });
});
