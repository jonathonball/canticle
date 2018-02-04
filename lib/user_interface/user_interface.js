const EventEmitter = require('events');
const Blessed = require('blessed');
const Components = require('./components');
const ValidateUrl = require('valid-url');
const YouTubeDl = require('youtube-dl');

class UserInterface extends EventEmitter {
    
    constructor(storage) {
        super();

        this.storage = storage;

        const screen = this.screen = Blessed.screen({
            smartCSR: true,
            log: './screen.log',
            fullUnicode: true,
            autoPadding: true,
            dockBorders: true,            
        });    

        screen.key(['C-c'], () => {
            this.shutdown();
        });

        this.commandConsole = new Components.CommandConsole(screen, storage);
        this.log = this.commandConsole.log;
        this.playlistManager = new Components.PlaylistManager(screen, storage);
        this.playlist = new Components.Playlist(screen, storage);
        this.player = new Components.Player(screen, storage);
        this.components = [
            this.commandConsole,
            this.playlist,
            this.playlistManager,
            this.player
        ];

        this.log.log('Welcome to Canticle.');
        this.commandConsole.focus();
        this.events();
        screen.render();
    }

    events() {
        this.components.forEach((component) => {
            component.on('error', (err) => {
                if (err.message) {
                    this.log.log(err.message);
                } else {
                    throw err;
                }
            });

            component.on('info', (message) => {
                this.log.log(message);
            });

            component.on('log', (message) => {
                this.screen.log(message);
            });
        }, this);

        this.commandConsole.on('command_close', () => {
            this.shutdown();
        });

        this.commandConsole.on('command_open', (name) => {
            if (this.playlist.isLoaded()) {
                if (name) {
                    if (!isNaN(name)) {
                        this.startPlayback(name);
                    } else {
                        this.openPlaylist(name);
                    }
                } else {
                    this.startPlayback();
                }
            } else {
                this.openPlaylist(name);
            }
        });

        this.commandConsole.on('command_pause', () => {
            this.player.pause();
        });

        this.commandConsole.on('command_info', () => {
            let track = this.playlist.getSelected();
            if (track) {
                this.log.log(track.title);
                this.log.log(track.url);
                this.log.log(this.player.description);
            }
        });

        this.commandConsole.on('command_shuffle', () => {
            this.playlist.mix();
        });

        this.commandConsole.on('command_next', () => {
            if (this.player.isPlaying()) {
                this.player.pause();
                this.playlist.next();
                this.startPlayback();
            } else {
                this.playlist.next();
            }
            this.log.log('Advancing to next track');
            this.screen.render();
        });

        this.commandConsole.on('command_open_playlist', (name) => {
            this.openPlaylist(name);
        });

        this.commandConsole.on('command_open_track', (index) => {
            this.startPlayback(index);
        });

        this.commandConsole.on('command_add_playlist', (name) => {
            let addPlaylistQuery = this.storage.Playlist.create({ name: name });
            this.playlistManager.addPlaylist(addPlaylistQuery);
        });

        this.commandConsole.on('command_delete_playlist', (name) => {
            let deletePlaylistQuery = this.storage.Playlist.destroy({ where: { name: name } });
            this.playlistManager.deletePlaylist(deletePlaylistQuery, name);
        });

        this.commandConsole.on('command_add_track', (uri) => {
            if (this.playlist.isLoaded()) {
                this.log.log('Loading track info.');
                if (ValidateUrl.isWebUri(uri)) {
                     YouTubeDl.getInfo(uri, (err, info) => {
                         let addTrackQuery = this.storage.Track.create({
                             title: info.title,
                             url: uri,
                             playlist_id: this.playlist.playlist.id,
                         });
                         this.playlist.addTrack(addTrackQuery);
                     });
                 } else {
                     this.log.log('Track must be a web uri');
                 }
            } else {
                this.log.log('No playlist loaded.');
            }
        });

        this.player.on('mplayer_error', (message) => {
            this.screen.log(message);
        });

        this.player.on('stop_natural', () => {
            this.screen.log('playback ended naturally');
            this.playlist.next();
            this.startPlayback();
        });

        this.player.on('stop_user', () => {
            this.screen.log('user requested playback stop');
        });
    }

    startPlayback(index = false) {
        if (index) {
            if (!isNaN(index)) {
                if (this.playlist.select(index)) {
                    this._startPlayback();
                }
            } else {
                this.log.log('Unable to load playlist ' + index + '.');
            }
        } else {
            this._startPlayback();
        }

    }

    _startPlayback() {
        let track = this.playlist.getSelected();
        if (this.playlist.isLoaded() && track) {
            this.log.log('Loading ' + track.title + '.');
            YouTubeDl.getInfo(track.url, (err, info) => {
                let audioStream = this._getStream(info.formats, track.url);
                this.player.duration = info.duration;
                this.player.description = info.description;
                this.player.open(audioStream.url);
                this.screen.render();
            });
        } else {
            this.log.log('No playlist is loaded.');
        }
    }

    _getStream(formats, url) {
        if (url.indexOf('youtube') != -1) {
            return formats.filter(({vcodec}) => vcodec == 'none')
                          .reduce((p, n) => (p.tbr > n.tbr) ? p : n);
        } else {
            return formats.reverse()[0];
        }
    }

    openPlaylist(name) {
        let playlist = this.playlistManager.getPlaylist(name);
        if (playlist) {
            if (this.player.isPlaying()) {
                this.player.pause();
            }
            this.playlistManager.select(playlist.name);
            this.playlist.addTracks(playlist);
        } else {
            this.log.log('Error loading playlist ' + name + '.');
        }
    }

    shutdown() {
        this.screen.destroy();
        this.player.quit();
        this.emit('shutdown');
    }

}

module.exports = UserInterface;
