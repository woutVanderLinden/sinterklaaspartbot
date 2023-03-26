module.exports = {
	cooldown: 0,
	help: `Unbans a user from hosting raids`,
	permissions: 'gamma',
	commandFunction: function (Bot, room, time, by, args, client) {
		const protoDB = require('origindb')('data/POGO'), DB = protoDB('users');
		const id = toID(args.join(''));
		if (!id) return Bot.roomReply(room, by, `Please mention the user you plan on refenestrating`);
		const user = DB.get(id);
		if (!user) return Bot.roomReply(room, by, `Uhh, I don't think ${id} is a registered user...`);
		if (!user.hostBanned) {
			if (user.raidBanned) {
				// eslint-disable-next-line max-len
				return Bot.roomReply(room, by, `They're not hostbanned, but they ARE raidbanned - did you mean to use ${prefix}unraidban instead?`);
			} else return Bot.roomReply(room, by, `B-but they aren't hostbanned D:`);
		}
		user.hostBanned = false;
		DB.set(id, user);
		return Bot.roomReply(room, by, `${user.displayName} has been re-permitted to host raids`);
	}
};
