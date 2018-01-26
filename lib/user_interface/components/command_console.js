const EventEmitter = require('events');
const Blessed = require('blessed');
const CommandTranslator = require('../../command_translator');

class CommandConsole extends EventEmitter {

    constructor(screen) {
        super();
        this.screen = screen;
        this.layout();
        this.events();
        this.commandTranslator = new CommandTranslator();
    }

    layout() {
        const container = this.container = Blessed.box({
            parent: this.screen,
            label: '[ Command Console ]',
            padding: 1,
            width: '100%',
            height: 12,
            left: '0',
            bottom: '0',
            border: {
                type: 'line',
                fg: 'yellow'
            }
        });
        
        this.log = Blessed.log({
            parent: this.container,
            tags: true,
            bottom: 2,
            top: 0,
            left: 0,
            right: 0,
            keys: true,
            vi: true,
            mouse: true,
            fg: 'white'
        });
        
        this.container.append(Blessed.text({
            height: 1,
            width: 2,
            bottom: 0,
            left: 0,
            content: '>',
            bg: 'grey'
        }));
        
        this.input = Blessed.Textbox({
            parent: this.container,
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
        });
    }

    events() {
        this.input.on('submit', (userInput) => {
            this.parseConsoleInput(userInput);
        });
    }

    parseConsoleInput(userInput) {
        this.input.setValue('');
        this.input.focus();
        let translation = this.commandTranslator.translate(userInput);
        if (translation.failure) {
            this.commandFailure(translation);
        } else {
            this.emit('console_input', translation);
        }
        this.screen.render();
    }

    commandFailure(translation) {
        this.log.log('Invalid command: ' + translation.failure);
        if (translation.additionalFailures) {
            translation.additionalFailures.forEach((failure) => {
                this.log.log(failure);
            }, this);
        }
    }

}

module.exports = CommandConsole;
