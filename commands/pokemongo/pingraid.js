module.exports = {
	cooldown: 0,
	help: `Pings everyone in a raid.`,
	permissions: 'none',
	commandFunction: function (Bot, room, time, by, args, client) {
		const user = toID(by);
		const raids = Bot.rooms[room].raids || {};
		if (!Object.keys(raids).length) return Bot.pm(by, "No raids are active, whoops");
		const host = toID(args.join('')) || user;
		if (!raids.hasOwnProperty(host)) return Bot.pm(by, `T-that user isn't hosting? I think?`);
		if (!tools.hasPermission(by, 'gamma', room) && host !== user) {
			return Bot.pm(by, 'Access DENIED - you may not ping for another user\'s raid!');
		}
		const raid = raids[host];
		const pings = Object.values(raid.players);
		if (!pings.length) return Bot.say(room, `B-but no one even joined D:`);
		Bot.say(room, `/wall Raid time! Pinging ${tools.listify(pings)}`);
		Bot.commandHandler('lockraid', by, args, room, true);
	}
};
