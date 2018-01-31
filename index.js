const UserInterface = require('./lib/user_interface');
const Storage = require('./lib/storage');
const ValidateUrl = require('valid-url');
const YouTubeDl = require('youtube-dl');

var storage = new Storage();

storage.on('ready', (initialPlaylists) => {
    var userInterface = new UserInterface();

    userInterface.on('command_add_playlist', (name) => {
        let addPlaylistQuery = storage.Playlist.create({ name: name });
        userInterface.playlistManager.addPlaylist(addPlaylistQuery);
    });

    userInterface.on('command_add_track', (uri) => {
        if (userInterface.playlist.isLoaded()) {
            userInterface.log.log('Loading track info.');
            if (ValidateUrl.isWebUri(uri)) {
                 YouTubeDl.getInfo(uri, (err, info) => {
                     userInterface.log.log(info.url);
                     let addTrackQuery = storage.Track.create({
                         title: info.title,
                         url: uri,
                         playlist_id: userInterface.playlist.playlist.id,
                     });
                     userInterface.playlist.addTrack(addTrackQuery);
                 });
             } else {
                 userInterface.log.log('Track must be a web uri');
             }
        } else {
            userInterface.log.log('No playlist loaded.');
        }
    });

    userInterface.on('command_delete_playlist', (name) => {
        let deletePlaylistQuery = storage.Playlist.destroy({ where: { name: name } });
        userInterface.playlistManager.deletePlaylist(deletePlaylistQuery, name);
    });

    userInterface.on('command_open_playlist', (name) => {
        let playlist = userInterface.playlistManager.getPlaylist(name);
        if (playlist) {
            userInterface.playlistManager.select(playlist.name);
            userInterface.playlist.addTracks(playlist);
        } else {
            userInterface.log.log('Error loading playlist ' + name);
        }
    });

    userInterface.on('command_open', () => {
        let playlist = userInterface.playlist.getSelected();
        if (userInterface.playlist.isLoaded() && playlist) {
            userInterface.log.log('Loading ' + playlist.title);
            YouTubeDl.getInfo(playlist.url, (err, info) => {
                userInterface.log.log('this is where we would play');
                userInterface.log.log(info.url);
                userInterface.screen.render();
            });
        } else {
            userInterface.log.log('No playlist is loaded.');
        }
    });

    userInterface.on('command_close', () => {
        userInterface.screen.destroy();
        console.log('Goodbye!');
    });

    userInterface.log.log('Welcome to Canticle.');
    userInterface.playlistManager.addPlaylists(initialPlaylists);
    userInterface.commandConsole.focus();
});
