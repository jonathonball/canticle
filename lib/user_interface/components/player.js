const EventEmitter = require('events');
const Blessed = require('blessed');

class Playlist extends EventEmitter {
    
    constructor(screen) {
        super();
        this.screen = screen;
        this.layout();
        this.events();
    }

    layout() {
        const container = this.container = Blessed.box({
            parent: this.screen,
            label: '[ Now Playing ]',
            padding: 1,
            left: 0,
            bottom: 11,
            width: '30%',
            height: 10,
            border: {
                type: 'line',
                fg: 'yellow'
            },
        });
    }

    events() {
        // stubbed
    }

}

module.exports = Playlist;
