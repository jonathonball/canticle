const blessed = require('./blessed-canticle');
const EventEmitter = require('events');
const t = require('./templates');

class Canticle extends EventEmitter {

    constructor(blessedLogFullPath) {
        super();

        const screen = this.screen = blessed.screen({
            smartCSR: true,
            log: blessedLogFullPath,
            fullUnicode: true,
            autoPadding: true,
            dockBorders: true,
            debug: true
        });

        screen.key(['C-c'], () => {
            this.emit('shutdown');
        });

        this.loadedPlaylistsNames = [];
        this.loadedPlaylist = '';
        this.loadedPlaylistId = 0;
        this.loadedPlaylistTracks = [];
        this.loadedTrackId = 0;
        this.playlistManagerLayout();
        this.playlistManagerEvents();
        this.playlistLayout();
        this.playlistEvents();
        this.playerLayout();
        this.playerEvents();
        this.commandConsoleLayout();
        this.commandConsoleEvents();
        screen.render();
    }

    commandConsoleLayout() {
        const commandConsoleContainer = this.commandConsoleContainer = blessed.box(t.commandConsole.containerBox);
        this.commandConsoleLog = this.log = blessed.log(t.commandConsole.log);
        this.commandConsoleInput = blessed.Textbox(t.commandConsole.input);
        commandConsoleContainer.append(this.commandConsoleLog);
        commandConsoleContainer.append(blessed.text(t.commandConsole.promptText));
        commandConsoleContainer.append(this.commandConsoleInput);
        this.screen.append(commandConsoleContainer);
    }

    commandConsoleEvents() {
        this.commandConsoleInput.on('submit', (userInput) => {
            this.commandConsoleInput.setValue('');
            this.commandConsoleInput.focus();
            this.emit('console_input', userInput);
        });
    }

    playlistManagerLayout() {
        const playlistManagerContainer = this.playlistManagerContainer = blessed.box(t.playlistManager.containerBox);
        this.playlistManagerList = blessed.list(t.playlistManager.list);

        this.screen.append(playlistManagerContainer);
        playlistManagerContainer.append(this.playlistManagerList);
    }

    playlistManagerEvents() {

    }

    playlistManagerHasItem(name) {
        return (this.loadedPlaylistsNames.indexOf(name) == -1) ? false : true;
    }

    playlistLayout() {
        const playlistContainer = this.playlistContainer = blessed.box(t.playlist.containerBox);
        this.playlistList = blessed.ListTable(t.playlist.list);

        this.screen.append(playlistContainer);
        playlistContainer.append(this.playlistList);
        playlistContainer.setLabel('[ Playlist ]');
    }

    playlistEvents() {

    }

    playerLayout() {
        const player = this.player = blessed.box(t.player.containerBox);

        this.screen.append(player);
    }

    playerEvents() {

    }

    currentTrack() {
        return this.loadedPlaylistTracks[this.loadedTrackId];
    }

    nextTrack() {
        this.loadedTrackId++;
        if (this.loadedTrackId >= this.loadedPlaylistTracks.length) {
            this.loadedTrackId = 0;
        }
        this.playlistList.select(this.loadedTrackId);
    }

    startPlayback() {
        let track = this.currentTrack();
        this.log.log('Starting playback for ' + track.title);
        this.emit('start_playback', track);
    }

    playlistManagerAddItem(name, options={ backend: false }) {
        let backend = (options.hasOwnProperty('backend') && options.backend) ? true : false;
        if (name.hasOwnProperty('failure')) {
            this.log.log('Error adding playlist ' + name.playlistName);
        } else {
            if (this.playlistManagerHasItem(name)) {
                this.log.log('Playlist ' + name + ' exists');
            } else {
                this.loadedPlaylistsNames.push(name);
                if (! backend) {
                    this.log.log('Playlist ' + name + ' added');
                }
                this.playlistManagerList.addItem(name);
            }
        }
        this.screen.render();
    }

    playlistManagerRemoveItem(name) {
        if (name.hasOwnProperty('failure') && name.failure) {
            this.log.log('Error removing playlist ' + name.playlistName);
        } else {
            let index = this.loadedPlaylistsNames.indexOf(name);
            if (index == -1) {
                this.log.log(name + ' not found');
            } else {
                this.playlistManagerList.clearItems();
                this.loadedPlaylistsNames.splice(index, 1);
                this.loadedPlaylistsNames.forEach((n) => {
                    this.playlistManagerList.addItem(n);
                });
                this.log.log('Playlist ' + name + ' removed');
            }
        }
        this.screen.render();
    }

    playlistManagerGetIndex(name) {
        return this.playlistManagerList.getItemIndex(name);
    }

    openPlaylist(playlist) {
        if (playlist.hasOwnProperty('failure') && playlist.failure) {
            this.log.log('Could not open playlist ' + playlist.playlistName);
        } else {
            this.playlistContainer.setLabel('[ Playlist (' + playlist.name + ') ]');
            this.loadedPlaylist = playlist.name;
            this.loadedPlaylistId = playlist.id;
            this.loadedPlaylistTracks.length = 0;
            this.loadedTrackId = 0;
            this.playlistManagerList.select(this.playlistManagerGetIndex(playlist.name));
            playlist.tracks.forEach((track) => {
                this.loadedPlaylistTracks.push(track);
            });
            this.playlistUpdateContent();
            this.log.log('Playlist ' + playlist.name + ' was loaded.');
            if (this.loadedPlaylistTracks.length) {
                this.startPlayback();
            }
        }
        this.screen.render();
        return true;
    }

    playlistUpdateContent() {
        let newListContent = [];
        this.playlistList.clearItems();
        this.loadedPlaylistTracks.forEach((track, index) => {
            newListContent.push([index, track.title]);
        });
        this.playlistList.setData(newListContent);
    }

    playlistAddItem(track) {
        if (track.hasOwnProperty('failure') && track.failure) {
            this.log.log('Error adding track: ' + track.message);
        } else {
            this.loadedPlaylistTracks.push(track);
            this.playlistUpdateContent();
            this.log.log('Added track ' + track.title);
        }
    }

    playlistRemoveItem(track) {

    }

}

module.exports = Canticle;
