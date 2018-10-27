const EventEmitter = require('events');
const Blessed = require('blessed');
const Components = require('./components');
const ValidateUrl = require('valid-url');
const YouTubeDl = require('youtube-dl');
const YTHelper = require('./../yt-helper');

class UserInterface extends EventEmitter {
    
    constructor(storage) {
        super();

        this.storage = storage;

        //const logg
        const screen = this.screen = Blessed.screen({
            smartCSR: true,
            log: this.storage.config.logging,
            fullUnicode: true,
            autoPadding: true,
            dockBorders: true,            
        });    

        this.commandConsole = new Components.CommandConsole(screen, storage);
        this.playlistManager = new Components.PlaylistManager(screen, storage);
        this.playlist = new Components.Playlist(screen, storage);
        this.player = new Components.Player(screen, storage);
        this.components = [
            this.commandConsole,
            this.playlist,
            this.playlistManager,
            this.player
        ];

        this.commandConsole.focus();
        this.keyboardEvents();
        this.events();
        screen.render();
    }

    isNameOrIndex(thing) {
        return (isNaN(thing)) ? 'name' : 'index';
    }

    events() {
        this.components.forEach((component) => {
            component.on('error', (err) => {
                if (err.message) {
                    this.commandConsole.dearUser(err.message);
                    this.screen.log(err);
                } else {
                    throw err;
                }
            });

            component.on('info', (message) => {
                this.commandConsole.dearUser(message);
            });

            component.on('log', (message) => {
                this.screen.log(message);
            });
        }, this);

        this.storage.JobManager.on('finish', (job, worker) => {
            switch (worker.result.type) {
                case 'validateUrlHasStreams':
                    if (! worker.result.pass) {
                        this.commandConsole.dearUser(worker.result.track.title + ' has no streams');
                    }
                    break;
                case 'addTrack':
                    if (worker.result.pass) {
                        this.commandConsole.dearUser('Added track ' + worker.result.title);
                        this.openPlaylist(worker.result.playlist);
                    } else {
                        this.commandConsole.dearUser('Failed to add track ' + (worker.result.title || worker.result.url));
                        this.commandConsole.dearUser(worker.result.error.message);
                    }
                    break;
                default:
            }
        });

        this.commandConsole.on('command_close', () => {
            this.shutdown();
        });

        this.commandConsole.on('command_open', (name) => {
            if (this.playlist.isLoaded()) {
                if (name) {
                    if (this.isNameOrIndex(name) == 'index') {
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

        this.commandConsole.on('command_open_playlist', (name) => {
            this.openPlaylist(name);
        });

        this.commandConsole.on('command_open_track', (index) => {
            this.startPlayback(index);
        });

        this.commandConsole.on('command_pause', () => {
            this.player.pause();
        });

        this.commandConsole.on('command_info', () => {
            let track = this.playlist.getSelected();
            if (track) {
                this.commandConsole.dearUser(track.title);
                this.commandConsole.dearUser(track.url);
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
            this.commandConsole.dearUser('Advancing to next track');
            this.screen.render();
        });

        this.commandConsole.on('command_add_playlist', (name) => {
            this.playlistManager.addPlaylist(name);
        });

        this.commandConsole.on('command_delete', () => {
            this.commandConsole.dearUser('Please specify track or playlist. (Example: delete track 1)');
        });

        this.commandConsole.on('command_delete_playlist', (name) => {
            let deletePlaylistQuery = this.storage.Playlist.destroy({ where: { name: name } });
            this.playlistManager.deletePlaylist(deletePlaylistQuery, name);
        });

        this.commandConsole.on('command_delete_track', (identifier) => {
            this.playlist.deleteTrack(identifier).then((deletedTitle) => {
                // TODO only pause if you deleted the track you are playing
                //if (this.player.isPlaying()) {
                //    this.player.pause();
                //}
                this.screen.render();
            }).catch((err) => {
                if (err) this.commandConsole.dearUser(err.message);
            });
            this.playlistManager.initialize();
        });

        this.commandConsole.on('command_add_track', (uri) => {
            if (this.playlist.isLoaded()) {
                this.commandConsole.dearUser('Loading track info.');
                if (ValidateUrl.isWebUri(uri)) {
                    if (uri.indexOf('playlist') !== -1) {
                        this.addYoutubePlaylist(this.playlist.playlist, uri);
                    } else {
                         YouTubeDl.getInfo(uri, (err, info) => {
                             this.playlist.addTrack(this.storage.Track.create({
                                 title: info.title,
                                 url: uri,
                                 playlist_id: this.playlist.playlist.id,
                             }));
                         });
                    }
                 } else {
                     this.commandConsole.dearUser('Track must be a web uri');
                 }
            } else {
                this.commandConsole.dearUser('No playlist loaded.');
            }
        });

        this.commandConsole.on('command_validate_playlist', (name) => {
            this.storage.Playlist.findAllByName(name).then((playlists) => {
                if (playlists.count > 1) {
                    this.commandConsole.dearUser('Cannot validate, playlist name is ambiguous');
                    return null;
                }
                if (playlists.count < 1) {
                    this.commandConsole.dearUser('Cannot validate, playlist not found');
                    return null;
                }
                this.commandConsole.dearUser('Starting validation of playlist ' + name);
                this.commandConsole.dearUser('Only invalid tracks will be reported');
                playlists.rows[0].validateTracks(this.storage.JobManager);
            });
        });

        this.commandConsole.on('command_autoplay', (noun) => {
            this.commandConsole.dearUser('Starting autoplay.');
            if (this.playlist.isLoaded()) {
                this.openPlaylistAndShuffle(this.playlistManager.getSelected());
            } else {
                this.playlistManager.initialize({ random: true }).then((playlist) => {
                    this.openPlaylistAndShuffle(playlist);
                });
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

    keyboardEvents() {
        this.screen.key(['C-c'], () => {
            this.shutdown();
        });

        this.screen.key(['left'], () => {
            this.player.rewind();
        });

        this.screen.key(['right'], () => {
            this.player.fastForward();
        });

        this.commandConsole.on('rewind', () => {
            this.player.rewind();
        });

        this.commandConsole.on('fast_forward', () => {
            this.player.fastForward();
        });

        this.screen.key(['S-up'], () => {
            this.player.volumeUp();
        });

        this.screen.key(['S-down'], () => {
            this.player.volumeDown();
        });

        this.commandConsole.on(['volume_up'], () => {
            this.player.volumeUp();
        });

        this.commandConsole.on(['volume_down'], () => {
            this.player.volumeDown();
        });

        this.commandConsole.on(['pageup'], () => {
            this.playlist.move('up');
        });

        this.commandConsole.on(['pagedown'], () => {
            this.playlist.move('down');
        });

        this.commandConsole.on(['first'], () => {
            this.playlist.select(this.playlist.getFirstIndex());
        });

        this.commandConsole.on(['last'], () => {
            this.playlist.select(this.playlist.getLastIndex());
        });
    }

    startPlayback(index = false) {
        if (index) {
            if (!isNaN(index)) {
                if (this.playlist.select(index)) {
                    this._startPlayback();
                }
            } else {
                this.commandConsole.dearUser('Unable to load playlist ' + index + '.');
            }
        } else {
            this._startPlayback();
        }

    }

    _startPlayback() {
        let track = this.playlist.getSelected();
        if (this.playlist.isLoaded() && track) {
            this.commandConsole.dearUser('Loading ' + track.title + '.');
            YouTubeDl.getInfo(track.url, (err, info) => {
                if (info && info.formats) {
                    let audioStream = YTHelper.getStream(info.formats, track.url);
                    this.player.duration = info.duration;
                    this.player.description = info.description;
                    this.player.open(audioStream.url, track, info);
                } else {
                    this.commandConsole.dearUser('Failed to load streams for ' + track.title);
                    this.commandConsole.emit('command_next');
                }
                this.screen.render();
            });
        } else {
            this.commandConsole.dearUser('No playlist is loaded.');
        }
    }

    openPlaylist(name) {
        let playlist = this.playlistManager.getPlaylist(name);
        if (playlist) {
            if (this.player.isPlaying()) {
                this.player.pause();
            }
            this.playlistManager.select(playlist.name);
            return this.playlist.addTracks(playlist);
        } else {
            this.commandConsole.dearUser('Error loading playlist ' + name + '.');
        }
    }

    openPlaylistAndShuffle(playlist) {
        if (playlist) {
            this.openPlaylist(playlist.name).then(() => {
                this.playlist.shuffle = true;
                this.playlist.next();
                this.startPlayback();
            });
        }
    }

    shutdown() {
        this.screen.destroy();
        this.player.quit();
        this.emit('shutdown');
    }

    processAutoloads() {
        let config = this.storage.config;
        this.commandConsole.dearUser(config.greeting);
        this.playlistManager.once('ready', () => {
            if (config.playlist) {
                if (this.playlistManager.getPlaylist(config.playlist)) {
                    this.openPlaylist(config.playlist);
                } else {
                    this.playlistManager.addPlaylist(config.playlist);
                }
                config._.forEach((paramUrl) => {
                    this.storage.JobManager.enqueue('addTrack',
                        paramUrl,
                        config.playlist,
                        this.storage.Playlist,
                        this.storage.Track
                    );
                });
            }
        });
        if (this.storage.config.autoplay) {
            this.playlistManager.initialize({ random: true }).then((playlist) => {
                this.openPlaylistAndShuffle(playlist);
            });
        } else {
            this.playlistManager.initialize();
        }
        return true;
    }

    addYoutubePlaylist(playlist, uri) {
        YouTubeDl.getInfo(uri, ['--flat-playlist'], (err, results) => {
            results.forEach((info) => {
                this.playlist.addTrack(this.storage.Track.create({
                    title: info.title,
                    url: 'http://www.youtube.com/watch?v=' + info.url,
                    playlist_id: playlist.id
                }));
            });
        });
    }

}

module.exports = UserInterface;
