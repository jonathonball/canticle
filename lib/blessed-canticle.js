const blessed = require('blessed');

blessed.screen.prototype.isWidgetAttached = function(childName) {
	return this.children.filter(({name}) => name == childName).length >= 1;
}

blessed.box.prototype.disable = function() {
	this.interactive = false;
}

blessed.box.prototype.enable = function() {
	this.interactive = true;
}


module.exports = blessed;
