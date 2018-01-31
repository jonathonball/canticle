/**
 * The module is heavily inspired by:
 * https://github.com/noodny/mplayer
 *  and
 * https://github.com/loics2/node-mplayer
*/

const EventEmitter = require('events');
const Spawn = require('child_process').spawn;
const readline = require('readline');

var defaultArgs = ['-novideo', '-nolirc', '-msglevel', 'global=6', '-msglevel', 'cplayer=4', '-slave', '-idle'];

class Player extends EventEmitter {

    constructor() {
        super();
        this.options = {
            args: [],
        };
    }

    spawn(args = []) {
        if(Array.isArray(args)) {
            this.options.args = this.options.args.concat(args);
        }

        var instance = Spawn('mplayer', defaultArgs.concat(args));
        instance.stderr.on('data', (data) => {
            this.emit('error', data.toString());
        });
        this.instance = instance;

        var rl = readline.createInterface({ input: instance.stdout });
        this.rl = rl;

        rl.on('close', () => {
            this.emit('player_exit');
        });

        rl.on('line', (input) => {
            this.parseStdout(input);
        });
    }

    command(command, args = []) {
        if(typeof args === 'string') {
            args = [args];
        }
        this.instance.stdin.write([command].concat(args).join(' ') + "\n");
    }

    parseStdout(input) {
        if (input.indexOf('EOF') !== -1) {
            if (input.indexOf('1') !== -1) {
                this.emit('eof_natural');
            }
            if (input.indexOf('4') !== -1 || input.indexOf('2') !== -1) {
                this.emit('eof_user');
            }
            return true;
        }
        if(input.indexOf('A:') === 0) {
            let time = this.parseCurrentTime(input);
            let total = this.parseRemainingTime(input);
            this.emit('timechange', time, total, input);
            return true;
        }
        if(input.indexOf('Starting playback...') !== -1) {
            this.emit('playstart');
        }
    }

    parseCurrentTime(input) {
        let timeStart, timeEnd;
        timeStart = input.indexOf('A:') + 2;
        timeEnd = input.indexOf(' (');
        return input.substring(timeStart, timeEnd).trim();
    }

    parseRemainingTime(input) {
        let start, end;
        start = input.indexOf('of') + 2;
        end = input.indexOf('(', input.indexOf('(') + 1);
        return input.substring(start, end);
    }

}

module.exports = Player;
