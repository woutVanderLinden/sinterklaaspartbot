module.exports = {
	help: `Displays when a user was last seen.`,
	permissions: 'none',
	commandFunction: function (Bot, by, args, client) {let user = toID(args.join(''));
	if (!user) return Bot.pm(by, 'Which user?');
	if (user === toID(Bot.status.nickName)) return Bot.pm(by, 'I\'m online. -_-');
	if (user === toID(by)) return Bot.pm(by, 'That nerd\'s online.');
	if (Bot.getRooms(user).length) return Bot.pm(by, `${args.join(' ').trim()} is online.`);
	let seen = require('origindb')('data/DATA')('joins').get(user);
	if (!seen) return Bot.pm(by, "Sorry, I haven't seen that user online.");
	return Bot.pm(by, `I last saw ${args.join(' ').trim()} around ${tools.toHumanTime(Date.now() - seen)} ago.`);
	}
}
		