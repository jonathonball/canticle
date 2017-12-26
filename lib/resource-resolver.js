const youtubedl = require('youtube-dl');
const EventEmitter = require('events');
const urlValidator = require('valid-url');

class ResourceResolver extends EventEmitter {

    constructor() {
        super();
        this.empty = {
            id: '',
            fulltitle: '',
            description: '',
            url: '',
        }
    }

    getInfo(url, eventName = 'track_info') {
        var self = this;
        youtubedl.getInfo(url, function(err, info) {
            if (err) {
                self.emit(eventName, self.empty);
                self.emit('resource_error', err);
            } else {
                let audioStreams = info.formats.filter(({vcodec}) => vcodec == 'none');
                if (audioStreams.length < 1) {
                    self.emit(eventName, self.empty);
                } else {
                    self.emit(eventName, {
                        id: info.id,
                        title: info.fulltitle,
                        description: info.description,
                        url: audioStreams[0].url
                    });
                }
            }
        });
    }

}

module.exports = ResourceResolver;
