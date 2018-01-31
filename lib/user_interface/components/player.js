const EventEmitter = require('events');
const Blessed = require('blessed');
const MPlayer = require('../../player');

class Player extends EventEmitter {
    
    constructor(screen) {
        super();
        this.screen = screen;
        this.player = new MPlayer();
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

    quit() {
        this.player.quit();
    }

    open(file) {
        this.player.open(file);
    }

}

module.exports = Player;
