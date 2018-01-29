const FIRST = 0;
const FAILURE_MESSAGE = "Expected but received";
const Response = require('../response');
const Word = require('./word');

class CommandTranslator {
    
    translate(command) {
        let words = command.split(' ').map((word) => new Word(word));
        if (words.length == 1) {
            return this.translateShort(words[FIRST]);
        } else {
            return this.translateFull(words);
        }
    }
    
    gatherArgs(words) {
        return words.filter((word) => word.argument);
    }

    gatherNouns(words) {
        return words.filter((word) => word.noun);
    }

    gatherVerbs(words) {
        return words.filter((word) => word.verb);
    }
    
    translateShort(word, translation = new Response()) {
        if (word.verb) {
            translation.verb = word.name;
            translation.unary = true;
        } else {
            translation.setFailure('Expected verb type keyword but received ' + word.getType());
        }
        return translation;
    }
    
    translateFull(words, translation = new Response()) {
        let nouns = this.gatherNouns(words);
        let verbs = this.gatherVerbs(words);
        let args = this.gatherArgs(words);
        if (nouns.length === 1) {
            translation.noun = nouns[FIRST].name;
        } else {
            translation.setFailure('Expected one noun type keyword but received ' + nouns.length);
        } 
        if (verbs.length === 1) {
            translation.verb = verbs[FIRST].name;
        } else {
            translation.setFailure('Expected one verb type keyword but received ' + verbs.length);
        }
        if (args.length === 1) {
            translation.arg = args[FIRST].name;
        } else {
            translation.setFailure('Expected one arbitrary parameter but received ' + args.length);
        }
        return translation;
    }

}

module.exports = CommandTranslator;
