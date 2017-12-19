const blessed = require('blessed');

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
		playlists.forEach(function(playlist) {
			this.addItem(playlist.name);
		}, this);
		this.select(0);
		this.focus();
		this.enable();
	} else {
		this.addItem('No playlists found');
		this.disable();
	}
}

module.exports = blessed;
