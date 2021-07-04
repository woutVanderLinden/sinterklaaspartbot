module.exports = {
	help: `Generates a random Scrabble-legal 6-letter word for Scrabblemons.`,
	guildOnly: "576487087558098945",
	commandFunction: function (args, message, Bot) {
		message.channel.send(`Scrabblemons word: \`\`${Object.keys(require('../data/WORDS/index.json')).filter(w => /^.{6}$/.test(w)).random().toUpperCase()}\`\``);
	}
}