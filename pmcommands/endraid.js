module.exports = {
	noDisplay: true,
	help: `End a PoGo raid`,
	permissions: 'none',
	commandFunction: function (Bot, by, args, client) {
		const room = 'pokemongo';
		if (!Bot.rooms[room]) return Bot.pm(by, `Uhh I'm not in Pokemon Go`);
		const user = toID(by);
		if (!Bot.rooms[room].users.find(u => toID(u) === user)) return Bot.pm(by, `<<pokemongo>>`);
		if (!tools.hasPermission(by, 'gamma', room)) return Bot.pm(by, 'Access DENIED!');
		const raids = Bot.rooms[room].raids || {};
		if (!Object.keys(raids).length) return Bot.pm(by, "No raids are active, whoops");
		const host = toID(args.join(''));
		if (!raids.hasOwnProperty(host)) return Bot.pm(by, `B-but who's hosting?`);
		const raid = raids[host];
		clearInterval(raid.timer);
		clearInterval(raid.warningTimer);
		clearInterval(raid.fiveTimer);
		clearInterval(raid.hostTimer);
		Bot.say(room, `/adduhtml RAIDHTML${host}, ${raid.hostName}'s ${raid.pokemon} raid has been ended by ${by.substr(1)}`);
		delete Bot.rooms[room].raids[host];
	}
};
