const blessed = require('blessed');
const youtube = require('youtube-dl');

const templates = require('./templates');
blessed.screen.prototype.templates = {
	messageBar: templates.messageBar,
	playlistManager: templates.playlistManager,
	playlist: templates.playlist,
	loading: templates.loading,
	debug: templates.debug,
}

blessed.screen.prototype.isWidgetAttached = function(childName) {
	return this.children.filter(({name}) => name == childName).length >= 1;
}

blessed.box.prototype.disable = function() {
	this.interactive = false;
}

blessed.box.prototype.enable = function() {
	this.interactive = true;
}

blessed.box.prototype.attachPlaylistManager = function(playlists) {
	if (playlists.length >= 1) {
		playlists.forEach((playlist) => this.addItem(playlist.name), this);
		this.select(0);
		this.focus();
		this.enable();
	} else {
		this.addItem('No playlists found');
		this.disable();
	}
}

// we should extend youtube-dl with this instead of box
// TODO move this to youtube-dl or it's own module
blessed.box.prototype.getRealYoutubeUrl = function(track) {
	return new Promise(function(resolve, reject) {
		if (track.hasOwnProperty('url')) {
			youtube.getInfo([track.url], function(err, info) {
				if (err) {
					reject(Error(err));
				}
				let audioStreams = info.formats.filter(({vcodec}) => vcodec == 'none');
				let streamData = {
					duration: info.duration,
					realUrl: audioStreams[0].url
				}
				resolve(streamData);
			});
		} else {
			reject(Error('malformed track'));
		}
	});
}

blessed.box.prototype.attachPlaylist = function(playlist) {
	if (playlist.tracks.length >= 1) {
		playlist.tracks.forEach((track) => this.addItem(track.title), this);
		this.select(0);
		this.focus();
		this.enable();
	} else {
		this.addItem('No tracks found');
		this.disable();
	}
}

module.exports = blessed;
