module.exports = {
	cooldown: 1000,
	help: `Sets the default difficulty level [1-3]. Syntax: ${prefix}setdefault (difficulty)`,
	permissions: 'gamma',
	commandFunction: function (Bot, room, time, by, args, client) {
		Bot.say(room, `BLANK`);
	}
}