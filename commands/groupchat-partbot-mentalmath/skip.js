module.exports = {
	cooldown: 1000,
	help: `Skips the current question.`,
	permissions: 'gamma',
	commandFunction: function (Bot, room, time, by, args, client) {
		if (!Bot.rooms[room].gameActive) return Bot.say(room, 'No game is active.');
		Bot.say(room, 'The answer was ' + Bot.rooms[room].ans + '!');
		Bot.rooms[room].gameActive = false;
		Bot.rooms[room].ans = null;
		Bot.rooms[room].ques = null;
		require('./newquestion.js').commandFunction(Bot, room, time, by, [], client);
	}
}