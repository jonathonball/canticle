var templates = {

    messageBar: {
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
    },

    playlistManager: {
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
    },

    playlist: {
        name: 'playlist',
        top: 2,
        left: 2,
        width: '50%',
        height: '50%',
        interactive: true,
        border: {
            type: 'line'
        },
        selectedBg: 'red',
        mouse: true,
        keys: true
    },

    alert: {
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
    },

    loading: {
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
    },

    debug: {
        name: 'debug',
        label: 'debug',
        top: 1,
        right: 1,
        width: '49%',
        height: '70%',
        border: {
            type: 'line'
        },
        style: {
            fg: '#ffffff',
            bg: '#000000',
            border: {
                fg: '#00ff00'
            }
        }
    },

    playlistManagerControls: {
        name: 'playlistControls',
        keys: true,
        left: 0,
        bottom: 0,
        width: '98%',
        height: 4,
        style: {
            fg: '#ffffff',
            bg: '#ff0000'
        },
        content: 'Controls'
    },

    createPlaylistButton: {
        name: 'createPlaylistButton',
        mouse: true,
        keys: true,
        shrink: true,
        padding: {
            left: 1,
            right: 1,
        },
        left: 1,
        bottom: 1,
        content: "Create playlist",
        style: {
            bg: '#0000ff',
            focus: {
                bg: '#5555ff'
            },
            hover: {
                bg: '#5555ff'
            }
        }
    }
}

module.exports = templates;
