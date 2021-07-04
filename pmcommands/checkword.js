module.exports = {
	help: `Checks whether a given word is Scrabble-legal.`,
	permissions: 'none',
	commandFunction: function (Bot, by, args, client) {
		let [word, dict, mod] = args.join('').split(',');
		let text = `${toID(word).toUpperCase()} is ${require('../data/WORDS/index.js').checkWord(word, dict, mod) ? '' : 'not '} a Scrabble-legal word.`;
		Bot.pm(by, text);
	}
}