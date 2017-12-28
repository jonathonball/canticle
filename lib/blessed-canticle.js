const blessed = require('blessed');

blessed.screen.prototype.isWidgetAttached = function(childName) {
    return this.children.filter(({canticleName}) => canticleName == childName).length >= 1;
};

blessed.list.prototype.disable = function() {
    this.interactive = false;
};

blessed.list.prototype.enable = function() {
    this.interactive = true;
};

module.exports = blessed;
