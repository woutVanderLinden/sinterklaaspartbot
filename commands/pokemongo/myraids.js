module.exports = {
	cooldown: 0,
	help: `Shows your PoGo raid list.`,
	permissions: 'none',
	commandFunction: function (Bot, room, time, by, args, client) {
		const protoDB = require('origindb')('data/POGO'), DB = protoDB('users');
		const user = DB.get(toID(by));
		if (!user) return Bot.roomReply(room, by, `You're not registered - try registering using ${prefix}setuser!`);
		const mons = Object.entries(user.raids).map(entry => {
			return [data.pokedex[entry[0]].name, entry[1]];
		}).map(entry => entry[1] ? `WB <b>${entry[0]}</b>` : entry[0]);
		Bot.say(room, `/sendprivatehtmlbox ${by}, Your current raid list is: ${mons.join(', ') || 'empty'}`);
	}
};
