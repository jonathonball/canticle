const MPlayer = require('mplayer');

MPlayer.prototype.quit = function() {
    this.player.cmd('quit');
};

MPlayer.prototype.load = function(file, options) {
    this.setOptions(options);
    this.player.cmd('loadfile', ['"' + file + '"']);
    this.status.playing = true;
}

module.exports = MPlayer;
