const EventEmitter = require('events');
const Blessed = require('blessed');
const Component = require('./component');

class Playlist extends Component {

    constructor(screen, storage) {
        super(screen, storage);
        this.loaded = false;
        this.tracks = [];
        this.shuffle = false;
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
        return playlist.getTracks().then((tracks) => {
            return new Promise((resolve, reject) => {
                if (! tracks.length) {
                    reject(Error('Playlist has no tracks'));
                } else {
                    tracks.forEach((track) => {
                        this._addTrack(track);
                    }, this);
                    this.screen.render();
                    resolve(true);
                }
            });
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

    getByIndex(index) {
        if (! this.isLoaded()) {
            this.emit('info', 'No playlist loaded.');
            return null;
        }
        if (isNaN(index)) {
            this.emit('info', index + ' is not a number.');
            return null;
        }
        return this.tracks[index - 1];
    }

    next() {
        let newSelection = 0;
        if (this.shuffle) {
            newSelection = Math.floor(Math.random() * this.tracks.length);
        } else {
            newSelection = this.list.selected;
            newSelection++;
            if (newSelection >= this.tracks.length) {
                newSelection = 0;
            }
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
            this.screen.render();
            return true;
        } else {
            index++;
            this.emit('info', 'Error loading track index ' + index + '.');
            return false;
        }
    }

    move(dir = 'down', offset = this.list.height) {
        let adjustedOffset = (dir == 'down') ? offset : offset * -1;
        this.list.move(adjustedOffset);
        this.indexList.move(adjustedOffset);
        this.screen.render();
    }

    mix() {
        this.shuffle = (this.shuffle) ? false : true;
        if (this.shuffle) {
            this.emit('info', 'Shuffle enabled.');
        } else {
            this.emit('info', 'Shuffle disabled.');
        }
    }

    getFirstIndex() {
        return 1;
    }

    getLastIndex() {
        return this.tracks.length;
    }

    deleteTrack(index) {
        return new Promise((resolve, reject) => {
            let trackToDelete = this.getByIndex(index);
            let deletedTitle = trackToDelete.title;
            if (trackToDelete) {
                if (this.playlist.name == this.storage.config.trashFolderName) {
                    trackToDelete.destroy().then(() => {
                        this.emit('info', deletedTitle + ' deleted.');
                        this.addTracks(this.playlist);
                    });
                } else {
                    this.getTrashPlaylist().then((playlist) => {
                        trackToDelete.update({
                            playlist_id: playlist.id
                        }).then(() => {
                            this.emit('info', deletedTitle + ' moved to trash playlist.');
                            this.addTracks(this.playlist);
                        });
                    });
                }
            }
        });
        this.screen.render();
    }

    getTrashPlaylist() {
        return this.storage.Playlist.findOrCreateByName(this.storage.config.trashFolderName);
    }

}

module.exports = Playlist;
