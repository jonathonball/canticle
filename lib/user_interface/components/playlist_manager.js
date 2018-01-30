const EventEmitter = require('events');
const Blessed = require('blessed');

class PlaylistManager extends EventEmitter {
    
    constructor(screen) {
        super();
        this.screen = screen;
        this.playlists = [];
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

    addPlaylists(playlistsQuery) {
        playlistsQuery.then((playlists) => {
            playlists.forEach((playlist) => {
                this.list.addItem(playlist.name);
                this.playlists.push(playlist);
            }, this);
            this.list.select();
            this.emit('info', 'Loaded ' + this.playlists.length + ' playlists.')
            this.screen.render();
        }).catch((err) => {
            this.emit('error', err);
        });
    }

    addPlaylist(playlistQuery) {
        playlistQuery.then((playlist) => {
            this.list.addItem(playlist.name);
            this.playlists.push(playlist);
            this.list.select(this.list.getItemIndex(playlist.name));
            this.emit('info', 'Added playlist ' + playlist.name + '.');
            this.screen.render();
        }).catch((err) => {
            this.emit('error', err);
        });
    }

    getPlaylist(identifier) {
        if (typeof identifier === 'number') {
            return this.playlists[identifier];
        } else if (typeof identifier === 'string') {
            return this.playlists.filter((playlist) => playlist.name === identifier)[0];
        }
        return null;
    }

    deletePlaylist(query, name) {
        query.then(() => {
            if (this.getPlaylist(name)) {
                this.list.clearItems();
                this.playlists = this.playlists.filter((playlist) => playlist.name != name);
                this.playlists.forEach((playlist) => {
                    this.list.addItem(playlist.name);
                }, this);
                this.emit('info', 'Deleted playlist ' + name + '.');
            } else {
                this.emit('info', 'Playlist ' + name + ' not found.');
            }
            this.screen.render();
        }).catch((err) => {
            this.emit('error', err);
        });
    }

    getSelected() {
        return this.playlists[this.list.selected];
    }

    select(name) {
        let index = this.playlists.findIndex((playlist) => playlist.name == name);
        if (index != -1) {
            this.list.select(index);
        }
    }

}

module.exports = PlaylistManager;
