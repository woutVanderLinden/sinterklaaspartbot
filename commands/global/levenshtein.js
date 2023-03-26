module.exports = {
	cooldown: 1,
	help: `Calculates the Levenshtein difference between two strings, separated by commas.`,
	permissions: 'none',
	commandFunction: function (Bot, room, time, by, args, client) {
		const lv = require('js-levenshtein');
		const input = args.join(' ').split(',').map(term => term.trim().toLowerCase());
		if (input.length !== 2) return Bot.pm(by, 'Expected two strings.');
		const output = lv(...input);
		if (tools.hasPermission(by, 'gamma', room)) {
			Bot.say(room, `The Levenshtein difference between the two given strings is ${output}.`);
		} else Bot.pm(by, `The Levenshtein difference between the two given strings is ${output}.`);
	}
};
