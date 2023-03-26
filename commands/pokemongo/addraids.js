module.exports = {
	cooldown: 0,
	help: `Adds Pokémon to your PoGo raid list.`,
	permissions: 'none',
	commandFunction: function (Bot, room, time, by, args, client) {
		const protoDB = require('origindb')('data/POGO'), DB = protoDB('users');
		const user = DB.get(toID(by));
		if (!user) return Bot.roomReply(room, by, `You're not registered - try registering using ${prefix}setuser!`);
		const specifiedMons = args
			.join('')
			.split(',')
			.map(toID)
			.map(m => [m.replace(/^wb/, ''), m.startsWith('wb')])
			.filter(m => data.pokedex.hasOwnProperty(m[0]));
		specifiedMons.forEach(m => user.raids[m[0]] = m[1]);
		if (Object.keys(user.raids).length > Bot.rooms[room]._raidsize) {
			// eslint-disable-next-line max-len
			return Bot.roomReply(room, by, `Sorry, but you can only have up to ${Bot.rooms[room]._raidsize} Pokémon in your raid list!`);
		}
		DB.set(toID(by), user);
		const mons = Object.entries(user.raids).map(entry => {
			return [data.pokedex[entry[0]].name, entry[1]];
		}).map(entry => entry[1] ? `WB <b>${entry[0]}</b>` : entry[0]);
		Bot.say(room, `/sendprivatehtmlbox ${by}, Your current raid list is: ${mons.join(', ') || 'empty'}`);
	}
};
