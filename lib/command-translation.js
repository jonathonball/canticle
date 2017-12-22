const thesaurus = require('thesaurus');

class CommandTranslator {
    constructor(fluent = false) {
        this.empty = {
            name: false,
            variants: [],
            helptext: ''
        }
		this.fluent = fluent;
        this.setupActions();
    }

    setupActions() {
        this.actions = [
            {
				name: 'add',
				variants: ['add', 'insert', 'create', '+', 'append', 'bestow', 'make', 'birth', 'divine'],
				helptext: "<verb> <noun>"
			},
            {
				name: 'delete',
				variants: ['delete', 'del', 'rm', '-', 'nuke', 'take', 'erase', 'kill', 'subtract'],
				helptext: "<verb> <noun>"
			},
            {
                name: 'play',
                variants: ['play', 'start', 'echo'],
                helptext: "<verb> <noun>"
            }
        ];
    }

	findVariantBase(needle) {
        let matches = this.actions.filter(({variants}) => variants.indexOf(needle) != -1);

		if (matches.length == 1) {
			return matches[0];
		}
		if (matches.length > 1) {
			let errorMessage = 'Command translation contains a conflicting verb variant';
			matches.forEach((match) => console.log(match));
			console.log(errorMessage);
			const err = new Error(errorMessage);
			throw err;
			process.exit(1);
		}
		return this.empty;
	}

    findVariantFluent(needle) {
        console.log('entered fluent search')
        let match = this.findVariantBase(needle);
        if (match.name != false) {
            return match;
        }
        let synonyms = thesaurus.find(needle).filter((word) => word.indexOf(' ') == -1);
        if (synonyms.length < 1) {
            return false;
        }
        let matches = synonyms.filter((synonym) => {
            return this.actions.filter(({name}) => name == synonym).length >= 1
        });
        if (matches.length > 1) {
            let errorMessage = 'Fluent translater was confused by the input.';
            console.log(errorMessage);
            matches.forEach((m) => console.log(m));
            const err = new Error(errorMessage);
            throw err;
            process.exit(1);
        };
        if (matches.length == 1) {
            return matches[0];
        }
        return false;
    }

	findCommand(needle) {
        if (this.fluent) {
            return this.findVariantFluent(needle).name;
        }
		return this.findVariantBase(needle).name;
	}

	findHelpText(needle) {
        if (this.fluent) {
		    return this.findVariantFluent(needle).helptext;
        }
        return this.findVariantBase(needle).helptext;
	}

}

module.exports = CommandTranslator;
