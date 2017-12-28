class CommandTranslator {
    constructor(fluent = false) {
        this.empty = {
            name: false,
            variants: [],
            helptext: ''
        };
        this.fluent = fluent;
        this.setupVerbs();
        this.setupNouns();
    }

    setupVerbs() {
        this.verbs = [
            {
                name: 'add',
                variants: ['add', 'insert', 'create', '+', 'append', 'bestow', 'make', 'birth', 'divine'],
                helptext: '<verb> <noun> <expression>'
            },
            {
                name: 'delete',
                variants: ['delete', 'del', 'rm', '-', 'nuke', 'take', 'erase', 'kill', 'subtract', 'remove'],
                helptext: '<verb> <noun> <expression>'
            },
            {
                name: 'open',
                variants: ['open', 'start', 'echo', 'play', 'spinup', 'cat'],
                helptext: '<verb> <noun> <expression>'
            },
            {
                name: 'close',
                variants: ['close', 'quit', 'exit', 'leave', 'shutdown', 'retreat'],
                helptext: '<verb>'
            }
        ];
    }

    setupNouns() {
        this.nouns = [
            {
                name: 'playlist',
                variants: ['playlist', 'p', 'pl', 'list'],
                helptext: '<noun>'
            },
            {
                name: 'track',
                variants: ['track', 'song', 't', 's'],
                helptext: '<noun>'
            }
        ];
    }

    find(type, word) {
        switch(type) {
            case 'noun':
                return this.findNoun(word);
            case 'verb':
                return this.findVerb(word);
            default:
                return this.empty;
        }
    }

    findNoun(word) {
        return this.matchInspector(
            this.nouns.filter(({variants}) => variants.indexOf(word) != -1),
            'noun'
        );
    }

    findVerb(word) {
        return this.matchInspector(
            this.verbs.filter(({variants}) => variants.indexOf(word) != -1),
            'verb'
        );
    }

    matchInspector(matches, type) {
        if (matches.length == 1) {
            return matches[0];
        }
        if (matches.length > 1) {
            let errorMessage = 'Command translation contains a conflicting word variant';
            matches.forEach((match) => console.log(match));
            process.exit(1);
        }
        return this.empty;
    }

    parseConsoleInput(userInput) {
        let inputArray = userInput.split(' ');
        let verb = inputArray.shift();
        let noun = inputArray.shift();
        let params = inputArray.join(' ');
        return {
            verb: this.findVerb(verb),
            noun: this.findNoun(noun),
            params: params,
            raw: userInput
        };
    }

}

module.exports = CommandTranslator;
