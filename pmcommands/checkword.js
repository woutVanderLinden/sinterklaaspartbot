module.exports = {
	help: `Checks whether a given word is Scrabble-legal. Syntax: \`\`${prefix}checkword word(, dict, mod)\`\``,
	permissions: 'none',
	commandFunction: function (Bot, by, args, client) {
		const [word, dict, mod] = args.join('').split(',');
		const WORDS = require('../data/WORDS/index.js');
		const text = `${toID(word).toUpperCase()} is ${WORDS.checkWord(word, dict, mod) ? '' : 'not '} a Scrabble-legal word.`;
		Bot.pm(by, text);
	}
};
