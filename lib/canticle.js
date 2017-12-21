const blessed = require('blessed');
const EventEmitter = require('events');
const t = require('./templates');

class Canticle extends EventEmitter {

	constructor() {
		super();

		const screen = this.screen = blessed.screen({
			smartCSR: true,
			log: process.env.HOME + '/blessed-terminal.log',
			fullUnicode: true,
			autoPadding: true
		});

		screen.key(['C-c'], () => {
			screen.destroy();
			console.log('Goodbye!');
			process.exit(0);
		});

		this.playlistManagerLayout();
		screen.render();
	}

	playlistManagerLayout() {
		const playlistManagerContainer = blessed.box(t.playlistManagerContainerBox);
		this.playlistManagerList = blessed.list(t.playlistManagerList);
		this.playlistManagerLog = blessed.log(t.playlistManagerLog);

		this.screen.append(playlistManagerContainer);
		playlistManagerContainer.append(this.playlistManagerList);
		playlistManagerContainer.append(this.playlistManagerLog);
		this.playlistManagerLog.log('test');
	}

}

module.exports = Canticle;
