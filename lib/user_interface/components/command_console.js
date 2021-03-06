const EventEmitter = require('events');
const Blessed = require('blessed');
const CommandTranslator = require('../../command_translator');
const Component = require('./component');

class CommandConsole extends Component {

    constructor(screen, storage) {
        super(screen, storage);
        this.history = [];
        this.historyIndex = 0;
        this.commandTranslator = new CommandTranslator();
        this.layout();
        this.events();
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
                if (key.shift) {
                    this.emit('volume_up');
                } else {
                    if (this.history.length > 0) {
                        const expression = this.history[this.history.length - (1 + this.historyIndex)];
                        if (expression) {
                            this.input.setValue(expression);
                            this.historyIndex++;
                            this.screen.render();
                        }
                    }
                }
            } else if (key.name === 'down') {
                if (key.shift) {
                    this.emit('volume_down');
                } else {
                    const expression = this.history[this.history.length - (this.historyIndex - 1)];
                    this.input.setValue((expression) ? expression : '');
                    this.historyIndex--;
                }
                this.screen.render();
            } else if (key.name === 'left') {
                this.emit('rewind');
            } else if (key.name === 'right') {
                this.emit('fast_forward');
            } else if (key.name === 'pagedown') {
                this.emit('pagedown');
            } else if (key.name === 'pageup') {
                this.emit('pageup');
            } else if (key.name === 'home') {
                this.emit('first');
            } else if (key.name === 'end') {
                this.emit('last');
            }
        });
    }

    parseConsoleInput(userInput) {
        this.input.setValue('');
        this.input.focus();
        let translation = this.commandTranslator.translate(userInput);
        if (translation.failure) {
            this.emit('log', 'command translation error');
            this.emit('log', userInput);
            this.emit('log', translation);
            this.commandFailure(translation);
        } else {
            let verb = translation.verb;
            let noun = translation.noun;
            let arg = translation.arg;
            let commandEvent = ['command', verb];
            if (noun) {
                commandEvent.push(noun);
            }
            if (commandEvent.length > 1) {
                let commandEventString = commandEvent.join('_');
                this.emit(commandEventString, arg);
                this.emit('log', 'User input: ' + commandEventString + ' ' + arg);
            }
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

    dearUser(message) {
        this.log.log(message);
    }


}

module.exports = CommandConsole;
