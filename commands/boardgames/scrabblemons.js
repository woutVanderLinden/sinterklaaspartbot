module.exports = {
	cooldown: 1000,
	help: `Generates a random Scrabble-legal 6-letter word for Scrabblemons.`,
	permissions: 'none',
	commandFunction: function (Bot, room, time, by, args, client) {
		const word = Object.keys(require('../../data/WORDS/index.js').dicts.csw21).filter(w => /^.{6}$/.test(w)).random();
		Bot.say(room, `Scrabblemons word: \`\`${word.toUpperCase()}\`\``);
	}
};
