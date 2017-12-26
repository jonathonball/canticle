
var playlist = {

    containerBox: {
        canticleName: 'playlist',
		padding: 1,
		width: '50%',
		height: '75%',
		left: '50%',
		top: '0%',
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
        bottom: '0',
        selectedBg: 'white',
        selectedFg: 'black',
        bg: 'black',
        mouse: true,
        keys: true
    }

}

module.exports = playlist;
