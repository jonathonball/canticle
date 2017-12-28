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
            this.gtfo();
        });

        this.loadedPlaylistsNames = [];
        this.loadedPlaylist = '';
        this.loadedPlaylistTracks = [];
        this.playlistManagerLayout();
        this.playlistManagerEvents();
        this.playlistLayout()
        this.playlistEvents();
        this.playerLayout();
        this.playerEvents();
        this.commandConsoleLayout();
        this.commandConsoleEvents();
        screen.render();
    }

    gtfo() {
        this.screen.destroy();
        console.log('Goodbye!');
        process.exit(0);
    }

    checkBoolProperty(obj, prop) {
        return (obj.hasOwnProperty(prop) && obj[prop]);
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

    playlistLayout() {
        const playlistContainer = this.playlistContainer = blessed.box(t.playlist.containerBox);
        this.playlistList = blessed.list(t.playlist.list);

        this.screen.append(playlistContainer);
        playlistContainer.append(this.playlistList);
        playlistContainer.setLabel('[ Playlist ]')
    }

    playlistEvents() {

    }

    openPlaylist(playlist) {
        if (playlist.hasOwnProperty('failure') && playlist.failure) {
            this.log.log('Could not open playlist ' + playlist.playlistName);
        } else {
            this.playlistContainer.setLabel('[ Playlist (' + playlist.name + ') ]');
            this.loadedPlaylist = playlist.name;
        }
        this.screen.render();
    }

    playlistAddItem(track) {

    }

    playlistRemoveItem(track) {

    }

    playerLayout() {
        const player = this.player = blessed.box(t.player.containerBox);

        this.screen.append(player);
    }

    playerEvents() {

    }

}

module.exports = Canticle;
