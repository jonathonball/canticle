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
            debug: true
        });

        screen.key(['C-c'], () => {
            this.gtfo();
        });

        this.loadedPlaylistsNames = [];
        this.playlistManagerLayout();
        this.playlistLayout();
        this.playlistManagerEvents();
        this.playlistEvents();
        screen.render();
    }

    gtfo() {
        this.screen.destroy();
        console.log('Goodbye!');
        process.exit(0);
    }

    parseConsoleInput(userInput) {
        let inputArray = userInput.split(' ');
        let cmd = inputArray.shift();
        let params = inputArray.join(' ');
        return {
            cmd: cmd,
            params: params,
            raw: userInput
        };
    }

    playlistManagerLayout() {
        const playlistManagerContainer = blessed.box(t.playlistManager.containerBox);
        this.playlistManagerList = blessed.list(t.playlistManager.list);
        this.playlistManagerLog = this.plmLog = blessed.log(t.playlistManager.log);
        this.playlistManagerConsole = blessed.Textbox(t.playlistManager.consoleInput);

        this.screen.append(playlistManagerContainer);
        playlistManagerContainer.append(this.playlistManagerList);
        playlistManagerContainer.append(this.playlistManagerLog);
        playlistManagerContainer.append(blessed.Text(t.playlistManager.promptText));
        playlistManagerContainer.append(this.playlistManagerConsole);
        this.playlistManagerConsole.focus();
    }

    playlistManagerEvents() {
        this.playlistManagerConsole.on('submit', (userInput) => {
            let parsedInput = this.parseConsoleInput(userInput);
            this.playlistManagerConsole.setValue('');
            this.playlistManagerConsole.focus();
            this.emit('playlistManagerConsole', parsedInput);
        });
    }

    playlistManagerHasItem(name) {
        return (this.loadedPlaylistsNames.indexOf(name) == -1) ? false : true;
    }

    playlistManagerAddItem(name) {
        if (this.playlistManagerHasItem(name)) {
            this.playlistManagerLog.log('Playlist ' + name + ' exists');
        } else {
            this.loadedPlaylistsNames.push(name);
            this.playlistManagerList.addItem(name);
        }
        this.screen.render();
    }

    playlistManagerRemoveItem(name) {
        let index = this.loadedPlaylistsNames.indexOf(name);
        if (index == -1) {
            this.playlistManagerLog.log(name + ' not found');
        } else {
            this.playlistManagerList.clearItems();
            this.loadedPlaylistsNames.splice(index, 1);
            this.loadedPlaylistsNames.forEach((n) => {
                this.playlistManagerList.addItem(n);
            });
        }
        this.screen.render();
    }

    playlistLayout() {
        const playlistContainer = this.playlistContainer = blessed.box(t.playlist.containerBox);
        this.playlistList = blessed.list(t.playlist.list);
        this.playlistLog = this.plLog = blessed.log(t.playlist.log);
        this.playlistConsole = blessed.Textbox(t.playlist.consoleInput);

        this.screen.append(playlistContainer);
        playlistContainer.append(this.playlistList);
        playlistContainer.append(this.playlistLog);
        playlistContainer.append(blessed.Text(t.playlist.promptText));
        playlistContainer.append(this.playlistConsole);
        playlistContainer.hide();
    }

    playlistEvents() {
        this.playlistConsole.on('submit', (userInput) => {
            let parsedInput = this.parseConsoleInput(userInput);
            this.playlistConsole.setValue('');
            this.playlistConsole.focus();
            this.emit('playlistConsole', parsedInput);
        });
    }

}

module.exports = Canticle;
