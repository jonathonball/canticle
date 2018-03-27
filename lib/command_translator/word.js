// variants should also be readable from config
const verbs = [
    {
        name: 'add',
        variants: ['add', 'insert', 'create'],
    },
    {
        name: 'delete',
        variants: ['delete', 'del', 'rm'],
    },
    {
        name: 'open',
        variants: ['open', 'play'],
    },
    {
        name: 'pause',
        variants: ['pause'],
    },
    {
        name: 'close',
        variants: ['close', 'quit', 'exit', 'shutdown'],
    },
    {
        name: 'info',
        variants: ['info', 'about', 'details'],
    },
    {
        name: 'shuffle',
        variants: ['shuffle', 'randomize', 'random']
    },
    {
        name: 'next',
        variants: ['next', 'skip']
    },
    {
        name: 'validate',
        variants: ['validate', 'check', 'audit']
    }
];

const nouns = [
    {
        name: 'playlist',
        variants: ['playlist', 'pl', 'list'],
    },
    {
        name: 'track',
        variants: ['track', 'song'],
    }
];

class Word {

    constructor(word) {
        this.input = word;
        if(! this.identifyNoun() && ! this.identifyVerb()) {
            this.name = word;
            this.argument = true;
        }
        delete this.input;
    }

    identifyVerb() {
        let results = verbs.filter(({variants}) => variants.indexOf(this.input) != -1);
        if (results.length === 1) {
            this.verb = true;
            this.name = results[0].name;
            return true;
        }
        return false;
    }

    identifyNoun(word) {
        let results = nouns.filter(({variants}) => variants.indexOf(this.input) != -1);
        if (results.length === 1) {
            this.noun = true;
            this.name = results[0].name;
            return true;
        }
        return false;
    }

    getType() {
        if (this.noun) {
            return 'noun';
        }
        if (this.verb) {
            return 'verb';
        }
        if (this.argument) {
            return 'argument';
        }
    }
    
}

module.exports = Word;
