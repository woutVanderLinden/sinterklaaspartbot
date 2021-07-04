module.exports = {
	cooldown: 10000,
	help: `Changes the difficulty level for the active game.`,
	permissions: 'gamma',
	commandFunction: function (Bot, room, time, by, args, client) {
		Bot.say(room, `BLANK`);
	}
}