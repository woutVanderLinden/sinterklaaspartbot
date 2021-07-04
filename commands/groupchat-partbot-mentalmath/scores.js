module.exports = {
	cooldown: 1000,
	help: `Displays the scores for the current game!`,
	permissions: 'none',
	commandFunction: function (Bot, room, time, by, args, client) {
		if (!Bot.rooms[room].scores) return Bot.say(room, 'No game\'s active.');
		if (!Object.keys(Bot.rooms[room].scores).length) return Bot.say(room, 'No scores yet!');
		Bot.say(room, '/adduhtml SCORES,<HR>' + Object.keys(Bot.rooms[room].scores).sort((a, b) => Bot.rooms[room].scores[b] - Bot.rooms[room].scores[a]).map(user => tools.colourize(tools.toName(toID(user))) + ' (' + Bot.rooms[room].scores[toID(user)] + ')').join('<BR>') + '<HR>');
	}
}