const EventEmitter = require('events');
const Blessed = require('blessed');

class Playlist extends EventEmitter {
    
    constructor(screen) {
        super();
        this.screen = screen;
        this.layout();
        this.events();
        this.tracks = [];
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

        this.indexList = Blessed.list({
            parent: this.container,
            align: 'center',
            top: '0',
            left: '0',
            width: 3,
            bottom: '0',
            selectedBg: 'white',
            selectedFg: 'black',
            mouse: false,
            keys: false
        });

        this.list = Blessed.list({
            parent: this.container,
            top: 0,
            left: 4,
            right: 0,
            bottom: 0,
            selectedBg: 'white',
            selectedFg: 'black',
            mouse: true,
            keys: true
        });

    }

    events() {
        // stubbed
    }

    addTracks(playlist) {
        this.tracks = [];
        this.list.clearItems();
        this.indexList.clearItems();
        playlist.getTracks().then((tracks) => {
            if (tracks.length) {
                tracks.forEach((track) => {
                    this.list.addItem(track.title);
                    this.indexList.addItem((this.tracks.length + 1).toString());
                    this.indexList.select();
                    this.tracks.push(track);
                }, this);
                this.screen.render();
            }
        }).catch((err) => {
            this.emit('error', err);
        });
    }

    isLoaded() {
        return (this.tracks.length > 0);
    }

}

module.exports = Playlist;
