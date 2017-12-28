const EventEmitter = require('events');
const youtubedl = require('youtube-dl');
const urlValidator = require('valid-url');

class ResourceResolver extends EventEmitter {

    constructor() {
        super();
        this.empty = {
            id: '',
            fulltitle: '',
            description: '',
            playerUrl: '',
            failure: false
        };
    }

    getInfo(inputUrl, externalEventName='get_info') {
        let result = Object.assign({}, this.empty);
        result.externalEvent = externalEventName;
        if (this.isValidUrl(inputUrl)) {
            youtubedl.getInfo(inputUrl, (err, info) => {
                if (err) {
                    result.failure = true;
                    result.message = err.message;
                } else {
                    result.id = info.id;
                    result.fulltitle = info.fulltitle;
                    result.description = info.description;
                    result.playerUrl = info.url;
                    result.inputUrl = inputUrl;
                }
                this.emit(externalEventName, result);
            });
        } else {
            result.failure = true;
            result.message = 'Invalid URL provided.';
            this.emit(externalEventName, result);
        }
    }

    isValidUrl(url) {
        return urlValidator.isWebUri(url);
    }

}

module.exports = ResourceResolver;
