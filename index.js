const UserInterface = require('./lib/user_interface');

var userInterface = new UserInterface();


userInterface.on('shutdown', () => {
    console.log('Goodbye!');
})
