module.exports = {
	cooldown: 1000,
	help: `Ends the current game.`,
	permissions: 'gamma',
	commandFunction: function (Bot, room, time, by, args, client) {
		require('./scores.js').commandFunction(Bot, room, time, by, [], client);
		Bot.rooms[room].scores = null;
		Bot.rooms[room].gameActive = false;
		Bot.rooms[room].ans = null;
		Bot.rooms[room].ques = null;
		Bot.rooms[room].times = null;
		if (Bot.rooms[room].nextQuestion) clearTimeout(Bot.rooms[room].nextQuestion);
		return Bot.say(room, 'Game ended!');
	}
}