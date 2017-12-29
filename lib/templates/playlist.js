
var playlist = {

    containerBox: {
        canticleName: 'playlist',
		padding: 1,
		width: '70%+2',
		left: '30%-1',
		top: '0%',
        bottom: '11',
		border: {
			type: 'line',
			fg: 'yellow'
		},
	},

    list: {
        canticleName: 'playlistList',
        top: '0',
        left: '0',
        right: '0',
        bottom: '0',
        selectedBg: 'white',
        selectedFg: 'black',
        mouse: true,
        keys: true
    }

};

module.exports = playlist;
