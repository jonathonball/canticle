const MPlayer = require('mplayer');

MPlayer.prototype.quit = function() {
    this.player.cmd('quit');
};

module.exports = MPlayer;
