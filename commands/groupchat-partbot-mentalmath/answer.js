module.exports = {
	cooldown: 1,
	help: `Lets users answer an ongoing question. Syntax: ${prefix}answer (answer)`,
	permissions: 'none',
	commandFunction: function (Bot, room, time, by, args, client) {
		if (!Bot.rooms[room].gameActive) return Bot.say(room, 'No game is active.');
		if (args[0] && parseInt(args[0].replace(/[^0-9-]/g,'')) == Bot.rooms[room].ans) {
			Bot.say(room, 'Correct!');
			Bot.rooms[room].gameActive = false;
			Bot.rooms[room].ans = null;
			Bot.rooms[room].ques = null;
			if (Bot.rooms[room].scores[toID(by)]) Bot.rooms[room].scores[toID(by)] += (Bot.rooms[room].diff + 1);
			else Bot.rooms[room].scores[toID(by)] = Bot.rooms[room].diff + 1;
			Bot.rooms[room].nextQuestion = setTimeout(require('./newquestion.js').commandFunction, Bot.rooms[room].delay || 3000, Bot, room, time, by, [], client);
			Bot.rooms[room].nextQuestion;
			let ttime = Date.now() - Bot.rooms[room].questionTime;
			if (!Bot.rooms[room].times[toID(by)]) Bot.rooms[room].times[toID(by)] = ttime;
			else if (Bot.rooms[room].times[toID(by)] > ttime) Bot.rooms[room].times[toID(by)] = ttime;
		}
		else return Bot.say(room, 'Nope, that isn\'t it.');
	}
}