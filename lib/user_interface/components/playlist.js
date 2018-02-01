const EventEmitter = require('events');
const Blessed = require('blessed');

class Playlist extends EventEmitter {
    
    constructor(screen) {
        super();
        this.screen = screen;
        this.loaded = false;
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
        this.list.on('select', () => {
            this.indexList.select(this.list.selected);
            this.screen.render();
        });
    }

    addTracks(playlist) {
        this.loaded = true;
        this.tracks = [];
        this.list.clearItems();
        this.indexList.clearItems();
        this.playlist = playlist;
        playlist.getTracks().then((tracks) => {
            if (tracks.length) {
                tracks.forEach((track) => {
                    this._addTrack(track);
                }, this);
                this.screen.render();
            }
        }).catch((err) => {
            this.emit('error', err);
        });
    }

    addTrack(trackQuery) {
        trackQuery.then((track) => {
            this._addTrack(track);
            this.screen.render();
        }).catch((err) => {
            this.emit('error', err);
        });
    }

    _addTrack(track) {
        this.list.addItem(track.title);
        this.indexList.addItem((this.tracks.length + 1).toString());
        this.tracks.push(track);
    }

    isLoaded() {
        return this.loaded;
    }

    getSelected() {
        return this.tracks[this.list.selected];
    }

    next() {
        let newSelection = this.list.selected;
        newSelection++;
        if (newSelection >= this.tracks.length) {
            newSelection = 0;
        }
        this.list.select(newSelection);
        this.indexList.select(newSelection);
        this.screen.render();
    }

    select(index) {
        if (typeof index == 'string') {
            index = parseInt(index);
        }
        index = (index < 0) ? 0 : index - 1;
        let track = this.tracks[index];
        if (track) {
            this.list.select(index);
            this.indexList.select(index);
            return true;
        } else {
            this.emit('info', 'Error loading track index ' + index + '.');
            return false;
        }
    }

}

module.exports = Playlist;
