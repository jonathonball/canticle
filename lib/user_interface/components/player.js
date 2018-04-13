const EventEmitter = require('events');
const Blessed = require('blessed');
const MPlayer = require('../../player');
const Component = require('./component');

class Player extends Component {
    
    constructor(screen, storage) {
        super(screen, storage);
        this.player = new MPlayer();
        this.layout();
        this.events();
    }

    layout() {
        const container = this.container = Blessed.box({
            parent: this.screen,
            label: '[ Now Playing ]',
            padding: 1,
            left: 0,
            bottom: 11,
            width: '30%',
            height: 10,
            valign: 'top',
            border: {
                type: 'line',
                fg: 'yellow'
            },
        });

        const titleBar = this.title = Blessed.box({
            parent: container,
            left: 0,
            bottom: 0,
            right: 0,
            height: 1,
        });

    }

    events() {
        this.player.on('error', (message) => {
            this.emit('mplayer_error', message);
        });

        this.player.on('time', () => {
            this.container.setContent(this.player.status.raw);
            this.screen.render();
        });

        this.player.on('stop', (type) => {
            if (type == 'natural') {
                this.emit('stop_natural');
            } else {
                this.emit('stop_user');
            }
        });
    }

    quit() {
        this.player.quit();
    }

    open(file) {
        this.player.open(file);
    }

    pause() {
        if (this.player.status.playing) {
            this.emit('info', 'Stopping playback.');
        } else {
            this.emit('info', 'Resuming playback.');
        }
        this.player.pause();
    }

    isPlaying() {
        return this.player.status.playing;
    }

    rewind() {
        this.player.seekByInterval(-5);
    }

    fastForward() {
        this.player.seekByInterval(5);
    }

    volumeUp() {
        this.player.volumeChange(10);
    }

    volumeDown() {
        this.player.volumeChange(-10);
    }

}

module.exports = Player;
