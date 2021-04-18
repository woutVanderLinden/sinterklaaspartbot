module.exports = {
	cooldown: 1000,
	help: `Checks whether the given word is legal (according to me) in Scrabble.`,
	permissions: 'none',
	commandFunction: function (Bot, room, time, by, args, client) {
		if (!args.length) return Bot.pm(by, unxa);
		let word = toId(args.join('')).toUpperCase();
		Bot.say(room, `${word} is ${require('../../data/DATA/words.json').includes(word.toLowerCase()) ? 'a legal' : 'not a recognized'} Scrabble word.`);
	}
}