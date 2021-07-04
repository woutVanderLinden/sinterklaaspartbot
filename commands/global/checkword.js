module.exports = {
	cooldown: 0,
	help: `Checks whether a given word is Scrabble-legal.`,
	permissions: 'none',
	commandFunction: function (Bot, room, time, by, args, client) {
		let [word, dict, mod] = args.join('').split(',');
		let text = `${toID(word).toUpperCase()} is ${require('../../data/WORDS/index.js').checkWord(word, dict, mod) ? '' : 'not '} a Scrabble-legal word.`;
		if (tools.hasPermission(by, 'gamma', room)) Bot.say(room, text);
		else Bot.roomReply(room, by, text);
	}
}