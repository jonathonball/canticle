
var commandConsole = {

    containerBox: {
        canticleName: 'commandContainer',
		padding: 1,
		width: '75%',
		height: '25%',
		left: '0%',
		top: '75%',
		border: {
			type: 'line',
			fg: 'green'
		},
		bg: 'yellow'
	},

    log: {
        canticleName: 'commandLog',
        tags: true,
        bottom: 2,
        top: 0,
        left: 0,
        right: 0,
//        height: '100%-2',
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

    input: {
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

module.exports = commandConsole;
