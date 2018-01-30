const EventEmitter = require('events');
const Blessed = require('blessed');
const Components = require('./components');

class UserInterface extends EventEmitter {
    
    constructor() {
        super();
        
        const screen = this.screen = Blessed.screen({
            smartCSR: true,
            fullUnicode: true,
            autoPadding: true,
            dockBorders: true,            
        });    

        screen.key(['C-c'], () => {
            this.emit('command_close');
        });

        this.commandConsole = new Components.CommandConsole(screen);
        this.log = this.commandConsole.log;
        this.playlistManager = new Components.PlaylistManager(screen);
        this.playlist = new Components.Playlist(screen);
        this.player = new Components.Player(screen);

        this.events();
        screen.render();
    }

    events() {
        this.commandConsole.on('console_input', (commands) => {
            let verb = commands.verb;
            let noun = commands.noun;
            let arg = commands.arg;
            let commandEvent = ['command', verb];
            if (noun) {
                commandEvent.push(noun);
            }
            if (commandEvent.length > 1) {
                this.emit(commandEvent.join('_'), arg);
            }
            this.screen.render();
        });

        this.playlistManager.on('error', (err) => {
            if (err.message) {
                this.log.log(err.message);
            } else {
                throw err;
            }
        });

        this.playlistManager.on('info', (message) => {
            this.log.log(message);
        });
    }

}

module.exports = UserInterface;
