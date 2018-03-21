const Player = require('./player-core');

// YAMM stands for 'Yet Another Media Module'
class Yamm extends Player {

    constructor() {
        super();
        this.player = new Player();
        this.events();
        this.status = {
            playing: false,
            timeIndex: 0,
            timeTotal: 0,
            timePercent: '0%'
        };
        this.player.spawn();
    }

    events() {
        this.player.on('eof_natural', () => {
            this.status.playing = false;
            this.emit('stop', 'natural');
        });

        this.player.on('eof_user', () => {
            this.status.playing = false;
            this.emit('stop', 'user');
        });

        this.player.on('timechange', (time, total, raw) => {
            if (this.status.playing) {
                this.status.timeIndex = time;
                this.status.timeTotal = total;
                this.status.raw = raw;
                this.status.timePercent = parseInt(parseInt(time) / parseInt(total) * 100).toString() + '%';
                this.emit('time');
            }
        });

        this.player.on('playstart', () => {
            this.status.playing = true;
            this.emit('start');
        });

        this.player.on('error', (message) => {
            this.emit('error', message);
        });
    }

    command(command, args = []) {
        this.player.command(command, args);
    }

    open(path) {
        this.player.command('loadfile', path);
    }

    quit() {
        this.player.command('quit');
    }

    seekByInterval(seconds) {
        this.player.command('seek', [seconds, 0]);
    }

    seekByIntervalPercent(percent) {
        this.player.command('seek', [percent, 1]);
    }

    pause() {
        this.status.playing = ! this.status.playing;
        this.player.command('pause');
    }

    volumeChange(interval) {
        this.player.command('volume', interval)
    }

}

module.exports = Yamm;
