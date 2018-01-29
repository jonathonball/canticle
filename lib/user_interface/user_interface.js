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
            this.emit('shutdown');
            this.screen.destroy();
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
            // stubbed
        });
    }

}

module.exports = UserInterface;
