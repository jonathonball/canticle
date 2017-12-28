
var playlistManager = {

	containerBox: {
		label: '[ Playlist Manager ]',
		padding: 1,
		width: '30%',
		left: '0%',
		top: '0%',
		bottom: 20,
		border: {
			type: 'line',
			fg: 'yellow'
		},
		fg: 'white',
	},

	list: {
		canticleName: 'playlistManagerList',
		top: '0',
		left: '0',
		right: '0',
		bottom: '0',
		selectedBg: 'white',
		selectedFg: 'black',
		mouse: true,
		keys: true
	},

}

module.exports = playlistManager;
