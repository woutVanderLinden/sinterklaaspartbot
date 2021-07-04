module.exports = {
	cooldown: 0,
	help: `Removes a user from a raid.`,
	permissions: 'gamma',
	commandFunction: function (Bot, room, time, by, args, client) {
		const protoDB = require('origindb')('data/POGO'), DB = protoDB('users');
		const user = toID(by);
		args = args.join('').split(',').map(toID);
		if (args.length < 2) args.unshift(user);
		const raids = (Bot.rooms[room].raids || {});
		if (!Object.keys(raids).length) return Bot.pm(by, "No raids are active, whoops");
		const host = args.shift();
		if (!raids.hasOwnProperty(host)) return Bot.pm(by, `B-but who's hosting?`);
		const raid = raids[host];
		const toAdd = toID(args.shift());
		if (!raid.players[toAdd]) return Bot.roomReply(room, by, `They aren't in the raid!`);
		const toRemoveUser = DB.get(toAdd);
		if (!toRemoveUser) return Bot.roomReply(room, by, 'No one by that name is registered.');
		delete raid.players[toAdd];
		raid.HTML();
		Bot.say(room, `${toRemoveUser.displayName} was removed from ${raid.hostName}'s raid!`);
	}
}