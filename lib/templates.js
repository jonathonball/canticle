
var messageBar = {
    name: 'messageBar',
    bottom: 0,
    left: 'center',
    width: '100%',
    height: 'shrink',
    align: 'center',
    content: 'Welcome to canticle',
    tags: true,
    style: {
        fg: '#ffffff',
        bg: '#000000',
        border: {
            fg: '#f0f0f0'
        },
        hover: {
            bg: 'green'
        }
    }
};

var playlistManager = {
    name: 'playlistManager',
    top: 1,
    left: 1,
    width: '50%',
    height: '50%',
    interactive: true,
    border: {
        type: 'line'
    },
    bg: '#000000',
    selectedBg: 'red',
    mouse: true,
    keys: true
};

var playlist = {
    name: 'playlist',
    top: 0,
    right: 0,
    width: '50%',
    height: '50%',
    interactive: true,
    border: {
        type: 'line'
    },
    selectedBg: 'red',
    mouse: true,
    keys: true
};

var alert = {
    name: null,
    top: 'center',
    left: 'center',
    width: 25,
    height: 'shrink',
    tags: true,
    border: {
        type: 'line'
    },
    style: {
        fg: 'white',
        bg: 'black',
        border: {
            fg: 'white'
        }
    }
};

var loading = {
    name: 'loading',
    bottom: 3,
    left: 0,
    width: '25%',
    height: 'shrink',
    content: "Loading..",
    border: {
        type: 'line'
    },
    style: {
        fg: 'orange',
        bg: 'black',
        border: {
            fg: 'green'
        }
    }
};


module.exports = {
    messageBar: messageBar,
    playlistManager: playlistManager,
    playlist: playlist,
    alert: alert,
    loading: loading
}
