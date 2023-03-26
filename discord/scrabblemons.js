module.exports = {
	help: `Generates a random Scrabble-legal 6-letter word for Scrabblemons.`,
	guildOnly: "576487087558098945",
	commandFunction: function (args, message, Bot) {
		const randWord = Object.keys(require('../data/WORDS/index.js').dicts.csw21).filter(w => /^.{6}$/.test(w)).random();
		message.channel.send(`Scrabblemons word: \`\`${randWord.toUpperCase()}\`\``);
	}
};
