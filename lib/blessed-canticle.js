const blessed = require('blessed');

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
