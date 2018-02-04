const EventEmitter = require('events');

class Component extends EventEmitter {
    
    constructor(screen, storage) {
        super();
        this.screen = screen;
        this.storage = storage;
    }

}

module.exports = Component;
