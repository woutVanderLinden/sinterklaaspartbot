module.exports = {
	noDisplay: true,
	help: `Leave a PoGo raid`,
	permissions: 'none',
	commandFunction: function (Bot, by, args, client) {
		const protoDB = require('origindb')('data/POGO'), DB = protoDB('users');
		const room = 'pokemongo';
		if (!Bot.rooms[room]) return Bot.pm(by, `Uhh I'm not in Pokemon Go`);
		const user = toID(by);
		if (!Bot.rooms[room].users.find(u => toID(u) === user)) return Bot.pm(by, `<<pokemongo>>`);
		const raids = Bot.rooms[room].raids || {};
		if (!Object.keys(raids).length) return Bot.pm(by, "No raids are active, whoops");
		const host = toID(args.join(''));
		if (host === user) return Bot.pm(by, 'Kden');
		if (!DB.get(user)) return Bot.pm(by, 'You need to register first!');
		if (!raids.hasOwnProperty(host)) return Bot.pm(by, `B-but who's hosting?`);
		const raid = raids[host];
		if (!raid.players[user]) return Bot.pm(by, `B-but you aren't in D:`);
		if (raid.locked) return Bot.roomReply(room, by, `The raid is locked - you may no longer join or leave.`);
		delete raid.players[user];
		raid.HTML();
		Bot.say(room, `${by.substr(1)} left ${raid.hostName}'s raid.`);
	}
};
