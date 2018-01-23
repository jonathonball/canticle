const EventEmitter = require('events');
const Blessed = require('blessed');

class PlaylistManager extends EventEmitter {
    
    constructor(screen) {
        super();
        this.screen = screen;
        this.layout();
        this.events();
    }

    layout() {
        const container = this.container = Blessed.box({
            parent: this.screen,
    		label: '[ Playlist Manager ]',
    		padding: 1,
    		width: '30%',
    		left: '0%',
    		top: '0%',
    		bottom: 20,
    		border: {
    			type: 'line',
    			fg: 'yellow'
    		},
    		fg: 'white',
    	});
        
        this.list = Blessed.list({
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

module.exports = PlaylistManager;
