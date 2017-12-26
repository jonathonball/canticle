
var playlistManager = {

	containerBox: {
		label: 'Playlist Manager',
		padding: 1,
		width: '50%',
		height: '75%',
		left: '0%',
		top: '0%',
		border: {
			type: 'line',
			fg: 'green'
		},
		bg: 'yellow'
	},

	list: {
		canticleName: 'playlistManagerList',
		top: '0',
		left: '0',
		right: '0',
		bottom: '0',
		selectedBg: 'green',
		bg: 'black',
		mouse: true,
		keys: true
	},

}

module.exports = playlistManager;
