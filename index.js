const UserInterface = require('./lib/user_interface');
const Storage = require('./lib/storage');

var storage = new Storage();

storage.on('ready', () => {
    var userInterface = new UserInterface();

    userInterface.on('shutdown', () => {
        console.log('Goodbye!');
    });
});
