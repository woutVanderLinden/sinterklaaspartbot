module.exports = {
	cooldown: 10000,
	help: `Displays the moves for the shortest Othello match.`,
	permissions: 'gamma',
	commandFunction: function (Bot, room, time, by, args, client) {
		Bot.say(room, `d6 c4 d3 c6 b5 e6 d7 c5 f5`);
	}
};
