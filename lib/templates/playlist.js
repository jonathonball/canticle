
var playlist = {

    containerBox: {
        canticleName: 'playlist',
		padding: 1,
		width: '50%',
		height: '75%',
		left: '20%+5',
		top: '0%+5',
		border: {
			type: 'line',
			fg: 'green'
		},
		bg: 'yellow'
	},

    list: {
        canticleName: 'playlistList',
        top: '0',
        left: '0',
        right: '0',
        bottom: '4',
        selectedBg: 'white',
        selectedFg: 'black',
        bg: 'black',
        mouse: true,
        keys: true
    },

    log: {
		canticleName: 'playlistLog',
		tags: true,
		bottom: 2,
		left: 0,
		right: 0,
		height: 1,
		keys: true,
		vi: true,
		mouse: true,
		bg: 'white',
		fg: 'black'
	},

	promptText: {
		height: 1,
		width: 2,
		bottom: 0,
		left: 0,
		content: '>'
	},

	consoleInput: {
		height: 1,
		left: 2,
		bottom: 0,
		right: 0,
		style: {
			bg: 'grey'
		},
		clickable: true,
		keys: true,
		inputOnFocus: true
	}

}

module.exports = playlist;
