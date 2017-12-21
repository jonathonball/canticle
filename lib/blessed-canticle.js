const blessed = require('blessed');

blessed.screen.prototype.isWidgetAttached = function(childName) {
	return this.children.filter(({canticleName}) => canticleName == childName).length >= 1;
}

blessed.list.prototype.disable = function() {
	this.interactive = false;
}

blessed.list.prototype.enable = function() {
	this.interactive = true;
}

/*
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
*/
/*
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
*/
module.exports = blessed;
