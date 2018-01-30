const EventEmitter = require('events');
const Blessed = require('blessed');
const CommandTranslator = require('../../command_translator');

class CommandConsole extends EventEmitter {

    constructor(screen) {
        super();
        this.screen = screen;
        this.history = [];
        this.historyIndex = 0;
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
            this.history.push(userInput);
            this.parseConsoleInput(userInput);
        });

        this.input.on('keypress', (character, key) => {
            if (this.historyIndex < 0) {
                this.historyIndex = 0;
            }
            if (key.name === 'up') {
                if (this.history.length > 0) {
                    const expression = this.history[this.history.length - (1 + this.historyIndex)];
                    if (expression) {
                        this.input.setValue(expression);
                        this.historyIndex++;
                        this.screen.render();
                    }
                }
            } else if (key.name === 'down') {
                const expression = this.history[this.history.length - (this.historyIndex - 1)];
                this.input.setValue((expression) ? expression : '');
                this.historyIndex--;
                this.screen.render();
            }
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
        this.log.log('Invalid command try: help');
    }

    focus() {
        this.input.focus();
        this.screen.render();
    }

}

module.exports = CommandConsole;
