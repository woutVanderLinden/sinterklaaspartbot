module.exports = {
	cooldown: 100,
	help: `Adds points to a user. Syntax: ${prefix}addpoints (user), (points)`,
	permissions: 'beta',
	commandFunction: function (Bot, room, time, by, args, client) {
	Bot.say(room, `BLANK`);
	}
}