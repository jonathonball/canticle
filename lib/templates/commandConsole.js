
var commandConsole = {

    containerBox: {
        canticleName: 'commandContainer',
        label: '[ Command Console ]',
		padding: 1,
		width: '100%',
		height: 12,
		left: '0',
		bottom: '0',
		border: {
			type: 'line',
			fg: 'yellow'
		},
	},

    log: {
        canticleName: 'commandLog',
        tags: true,
        bottom: 2,
        top: 0,
        left: 0,
        right: 0,
        keys: true,
        vi: true,
        mouse: true,
        fg: 'white'
    },

    promptText: {
        height: 1,
        width: 2,
        bottom: 0,
        left: 0,
        content: '>',
        bg: 'grey'
    },

    input: {
        height: 1,
        left: 2,
        bottom: 0,
        right: 0,
        style: {
            bg: 'grey',
            fg: 'white',
        },
        clickable: true,
        keys: true,
        inputOnFocus: true
    }

}

module.exports = commandConsole;
