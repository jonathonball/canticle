const blessed = require('./blessed-canticle');
const EventEmitter = require('events');
const t = require('./templates');

class Canticle extends EventEmitter {

    constructor() {
        super();

        const screen = this.screen = blessed.screen({
            smartCSR: true,
            log: process.env.HOME + '/blessed-terminal.log',
            fullUnicode: true,
            autoPadding: true,
            debug: true
        });

        screen.key(['C-c'], () => {
            screen.destroy();
            console.log('Goodbye!');
            process.exit(0);
        });

        this.loadedPlaylistsNames = [];
        this.playlistManagerLayout();
        this.playlistManagerEvents();
        screen.render();
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
    }

    playlistManagerEvents() {
        this.playlistManagerConsole.on('submit', (userInput) => {
            let inputArray = userInput.split(' ');
            let cmd = inputArray.shift();
            let params = inputArray.join(' ');
            this.playlistManagerConsole.setValue('');
            this.playlistManagerConsole.focus();
            this.emit('playlistManagerConsole', {
                cmd: cmd,
                params: params
            });
        });
    }

    playlistManagerHasItem(name) {
        return (this.loadedPlaylistsNames.indexOf(name) == -1) ? false : true;
    }

    playlistManagerAddItem(name) {
        if (this.playlistManagerHasItem(name)) {
            this.playlistManagerLog.log('Playlist ' + name + 'exists');
        } else {
            this.loadedPlaylistsNames.push(name);
            this.playlistManagerList.addItem(name);
        }
        this.screen.render();
    }

    playlistManagerRemoveItem(name) {
        let index = this.loadedPlaylistsNames.indexOf(name);
        if (index == -1) {
            this.playlistManagerLog.log(name + 'not found');
        } else {
            this.playlistManagerList.clearItems();
            this.loadedPlaylistsNames.splice(index, 1);
            this.loadedPlaylistsNames.forEach((n) => {
                this.playlistManagerList.addItem(n);
            });
        }
        this.screen.render();
    }

}

module.exports = Canticle;
