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
