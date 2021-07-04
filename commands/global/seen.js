module.exports = {
	cooldown: 1,
	help: `Displays the time when a user was last seen.`,
	permissions: 'gamma',
	commandFunction: function (Bot, room, time, by, args, client) {
		let user = toID(args.join(''));
		if (!user) return Bot.pm(by, 'Which user?');
		if (user === toID(Bot.status.nickName)) return Bot.say(room, room === 'hindi' ? `Mai online hu. -_-` : 'I\'m online. -_-');
		if (user === toID(by)) return Bot.say(room, room === 'hindi' ? `Wo nerd online hi lag rahe hai.` : 'That nerd\'s online.');
		if (Bot.getRooms(user).length) return Bot.say(room, room === 'hindi' ? `${args.join(' ').trim()} online hai.` : `${args.join(' ').trim()} is online.`);
		let seen = require('origindb')('data/DATA')('joins').get(user);
		if (!seen) return Bot.say(room, room === 'hindi' ? 'Maaf karna; maine us user ko online nahi dekha hai.' : "Sorry, I haven't seen that user online.");
		return Bot.say(room, room === 'hindi' ? `Maine ${args.join(' ').trim()} ko ${tools.toHumanTime(Date.now() - seen)} pehle dekha tha.` : `I last saw ${args.join(' ').trim()} around ${tools.toHumanTime(Date.now() - seen)} ago.`);
	}
}