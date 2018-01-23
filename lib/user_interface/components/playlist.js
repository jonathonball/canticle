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
            label: '[ Playlist ]',
    		padding: 1,
    		width: '70%+2',
    		left: '30%-1',
    		top: '0%',
            bottom: '11',
    		border: {
    			type: 'line',
    			fg: 'yellow'
    		},
    	});
        
        this.list = Blessed.ListTable({
            parent: this.container,
            top: '0',
            left: '0',
            right: '0',
            bottom: '0',
            selectedBg: 'white',
            selectedFg: 'black',
            mouse: true,
            keys: true
        });
    }

    events() {
        // stubbed
    }

}

module.exports = Playlist;
