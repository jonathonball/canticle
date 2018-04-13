const EventEmitter = require('events');
const Blessed = require('blessed');
const MPlayer = require('../../player');
const Component = require('./component');

class Player extends Component {
    
    constructor(screen, storage) {
        super(screen, storage);
        this.player = new MPlayer();
        this.resetTitleOffset();
        this.layout();
        this.events();
        this.setUpdatedTime();
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

        const titleBar = this.titleBar = Blessed.box({
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
            this.updateWidgets();
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

    open(file, track, info) {
        this.track = track;
        this.info = info;
        this.player.open(file);
        this.resetTitleOffset();
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

    updateWidgets() {
        let lastUpdated = this.getUpdatedTime();
        let now = new Date().getTime();
        if ((now - lastUpdated) > this.storage.config.titleScrollInterval) {
            if (this.isPlaying()) {
                this.updateTitleBar();
                this.setUpdatedTime();
            }
        }
    }

    updateTitleBar(force = false) {
        let visibleSpace = this.titleBar.width;
        let visibleTitle = '';
        let title = this.track.title.split('');
        let titleLength = title.length;

        if (titleLength <= visibleSpace) {
            visibleTitle = title;
        } else {
            this.setMaxTitleOffset(visibleSpace, titleLength);
            let offset = this.getTitleOffset();
            visibleTitle = title.slice(offset, offset + visibleSpace);
        }
        this.titleBar.setContent(visibleTitle.join(''));
    }

    getUpdatedTime() {
        return this.updated;
    }

    setUpdatedTime() {
        this.updated = new Date().getTime();
        return this.updated;
    }

    getTitleOffset() {
        if (this.titleOffset >= this.getMaxTitleOffset()) {
            this.resetTitleOffset();
        }
        this.titleOffset++;
        return this.titleOffset;
    }

    resetTitleOffset() {
        this.titleOffset = -1;
    }

    setMaxTitleOffset(visibleSpace, titleLength) {
        this.maxTitleOffset = titleLength - visibleSpace;
    }

    getMaxTitleOffset() {
        return this.maxTitleOffset;
    }
}

module.exports = Player;
