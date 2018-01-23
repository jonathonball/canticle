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

        this.playlistManager = new Components.PlaylistManager(screen);
        this.playlist = new Components.Playlist(screen);
        this.commandConsole = new Components.CommandConsole(screen);
        this.player = new Components.Player(screen);
        screen.render();
    }

}

module.exports = UserInterface;
