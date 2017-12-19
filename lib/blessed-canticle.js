const blessed = require('blessed');
const MPlayer = require('mplayer');
const youtube = require('youtube-dl');

const templates = require('./templates');
blessed.screen.prototype.templates = {
	messageBar: templates.messageBar,
	playlistManager: templates.playlistManager,
	playlist: templates.playlist
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

blessed.box.prototype.makeMediaPlayer = function(track) {
	console.log('entered makeMediaPlayer');
	console.log(track.url);

	var player = new MPlayer();
	youtube.getInfo([track.url], function(err, info) {
		console.log('returned from youtube ajax call');
		if (err) throw err;
		let audioStreams = info.formats.filter(({vcodec}) => vcodec == 'none');
		console.log(audioStreams[0].url);
		player.openFile(audioStreams[0].url);
//		this.player.openFile(audioStreams[0].url);
		//console.log(audioStreams);
		//this.player.stop();
	});
	return player;
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
