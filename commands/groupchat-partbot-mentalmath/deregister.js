module.exports = {
	cooldown: 1000,
	help: `Removes a user from the invite database. Defaults to the sender if no user is supplied. Syntax: ${prefix}deregister (user)`,
	permissions: 'none',
	commandFunction: function (Bot, room, time, by, args, client) {
		if (args[0] && !tools.hasPermission(by, 'beta')) return Bot.say(room, 'Access denied.');
		if (!args[0]) {
			let users = JSON.parse(fs.readFileSync('./data/DATA/mentalmathers.json', 'utf8'));
			if (!users.includes(toID(by))) return Bot.say(room, 'You\'re not registered!');
			users.splice(users.indexOf(toID(by)), 1);
			fs.writeFileSync('./data/DATA/mentalmathers.json', JSON.stringify(users, null, 2), 'utf8');
			return Bot.say(room, 'You\'ve been deregistered!');
		}
		let user = toID(args.join(''));
		let users = JSON.parse(fs.readFileSync('./data/DATA/mentalmathers.json', 'utf8'));
		if (!users.includes(user)) return Bot.say(room, 'That user is not registered!');
		users.splice(users.indexOf(user), 1);
		fs.writeFileSync('./data/DATA/mentalmathers.json', JSON.stringify(users, null, 2), 'utf8');
		return Bot.say(room, '[[]]' + args.join(' ') + ' has been deregistered!');
	}
}