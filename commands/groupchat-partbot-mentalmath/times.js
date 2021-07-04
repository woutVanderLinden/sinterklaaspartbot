module.exports = {
	cooldown: 1000,
	help: `Displays the shortest times taken by users.`,
	permissions: 'gamma',
	commandFunction: function (Bot, room, time, by, args, client) {
		if (!Bot.rooms[room].times) return Bot.say(room, 'No game\'s active.');
		if (!Object.keys(Bot.rooms[room].times).length) return Bot.say(room, 'No times yet!');
		Bot.say(room, '/adduhtml TIMES,<HR>' + Object.keys(Bot.rooms[room].times).sort((a, b) => Bot.rooms[room].times[a] - Bot.rooms[room].times[b]).map(user => tools.colourize(tools.toName(toID(user))) + ' (' + Bot.rooms[room].times[toID(user)] + ' ms)').join('<BR>') + '<HR>');
	}
}