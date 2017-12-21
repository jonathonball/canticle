var template = {

    playlistManagerContainerBox: {
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

    playlistManagerList: {
        canticleName: 'playlistManagerList',
        top: '0%',
        left: '0',
        right: '0',
        bottom: '5',
        selectedBg: 'green',
        bg: 'black'
    },

    playlistManagerLog: {
        canticleName: 'playlistManagerLog',
        tags: true,
        bottom: 0,
        left: 0,
        right: 0,
        height: 1,
        keys: true,
        vi: true,
        mouse: true,
        bg: 'white',
        fg: 'black'
    }

}

module.exports = template;
