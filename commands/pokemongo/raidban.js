module.exports = {
	cooldown: 0,
	help: `Bans a user from joining (and hosting!) raids`,
	permissions: 'gamma',
	commandFunction: function (Bot, room, time, by, args, client) {
		const protoDB = require('origindb')('data/POGO'), DB = protoDB('users');
		const id = toID(args.join(''));
		if (!id) return Bot.roomReply(room, by, `Please mention the user you plan on defenestrating`);
		const user = DB.get(id);
		if (!user) return Bot.roomReply(room, by, `Uhh, I don't think ${id} is a registered user...`);
		if (user.raidBanned) return Bot.roomReply(room, by, `B-but they're already raidbanned D:`);
		user.raidBanned = true;
		DB.set(id, user);
		return Bot.roomReply(room, by, `${user.displayName} has been absolutely YEETED from joining raids`);
	}
};
