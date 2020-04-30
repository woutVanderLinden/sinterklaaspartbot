module.exports = {
	cooldown: 1,
	help: `Joins a game in signups.`,
	permissions: 'none',
	commandFunction: function (Bot, room, time, by, args, client) {
		if (Bot.rooms[room].blackjack) return require('./blackjack.js').commandFunction(Bot, room, time, by, ['join'], client);
    if (Bot.rooms[room].ev) return require('./explodingvoltorb.js').commandFunction(Bot, room, time, by, ['join'], client);
	}
}