module.exports = {
	cooldown: 0,
	help: `Adds a user to a raid.`,
	permissions: 'gamma',
	commandFunction: function (Bot, room, time, by, args, client) {
		const protoDB = require('origindb')('data/POGO'), DB = protoDB('users');
		const user = toID(by);
		args = args.join('').split(',').map(toID);
		if (args.length < 2) args.unshift(user);
		const raids = Bot.rooms[room]?.raids || {};
		if (!Object.keys(raids).length) return Bot.pm(by, "No raids are active, whoops");
		const host = args.shift();
		if (!raids.hasOwnProperty(host)) return Bot.pm(by, `B-but who's hosting?`);
		const raid = raids[host];
		const toAdd = toID(args.shift());
		if (Object.keys(raid.players).length >= raid.slots) {
			return Bot.roomReply(room, by, "T-the raid is full p-please don't hurt me");
		}
		if (raid.players[toAdd]) return Bot.roomReply(room, by, `They're already in the raid!`);
		const toAddUser = DB.get(toAdd);
		if (!toAddUser) return Bot.roomReply(room, by, 'No one by that name is registered.');
		raid.players[toAdd] = toAddUser.displayName;
		raid.HTML();
		Bot.say(room, `${toAddUser.displayName} was added to ${raid.hostName}'s raid!`);
		Bot.roomReply(room, toAdd, `The host's FC is ${raid.FC}.`);
	}
};
