module.exports = {
	cooldown: 0,
	help: `Ends a raid.`,
	permissions: 'none',
	commandFunction: function (Bot, room, time, by, args, client) {
		const user = toID(by);
		const raids = Bot.rooms[room].raids || {};
		if (!Object.keys(raids).length) return Bot.pm(by, "No raids are active, whoops");
		const host = toID(args.join('')) || user;
		if (!raids.hasOwnProperty(host)) return Bot.pm(by, `B-but who's hosting?`);
		if (!tools.hasPermission(by, 'gamma', room) && host !== user) return Bot.pm(by, 'Access DENIED!');
		const raid = raids[host];
		clearInterval(raid.timer);
		clearInterval(raid.warningTimer);
		clearInterval(raid.fiveTimer);
		clearInterval(raid.hostTimer);
		// eslint-disable-next-line max-len
		Bot.say(room, `/adduhtml RAIDHTML${host}, ${raid.hostName}'s ${raid.pokemon} raid has been ended${host === user ? '' : ` by ${by.substr(1)}`}.`);
		delete Bot.rooms[room].raids[host];
	}
};
