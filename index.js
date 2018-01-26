const UserInterface = require('./lib/user_interface');
const CommandTranslator = require('./lib/command_translator');

var userInterface = new UserInterface();
var commandTranslator = new CommandTranslator();

userInterface.on('shutdown', () => {
    console.log('Goodbye!');
});
