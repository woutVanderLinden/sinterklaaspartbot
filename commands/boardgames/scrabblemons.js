module.exports = {
	cooldown: 1000,
	help: `Generates a random Scrabble-legal 6-letter word for Scrabblemons.`,
	permissions: 'none',
	commandFunction: function (Bot, room, time, by, args, client) {
		Bot.say(room, `Scrabblemons word: \`\`${Object.keys(require('../../data/WORDS/index.json')).filter(w => /^.{6}$/.test(w)).random().toUpperCase()}\`\``);
	}
}