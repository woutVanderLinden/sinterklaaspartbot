module.exports = {
	cooldown: 0,
	help: `Unlocks a raid.`,
	permissions: 'none',
	commandFunction: function (Bot, room, time, by, args, client) {
		const user = toID(by);
		const raids = (Bot.rooms[room].raids || {});
		if (!Object.keys(raids).length) return Bot.pm(by, "No raids are active, whoops");
		const host = toID(args.join('')) || user;
		if (!raids.hasOwnProperty(host)) return Bot.pm(by, `B-but who's hosting?`);
		if (!tools.hasPermission(by, 'gamma', room) && host !== user) return Bot.pm(by, 'Access DENIED!');
		const raid = raids[host];
		if (raid.locked) return Bot.roomReply(room, by, '(It was already unlocked)');
		Bot.say(room, `/adduhtml RAIDHTML${host}LOCK, ${raid.hostName}'s ${raid.pokemon} raid has been unlocked.`);
		raid.locked = false;
	}
}