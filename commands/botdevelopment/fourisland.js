module.exports = {
	cooldown: 1,
	help: `Form link.`,
	permissions: 'none',
	commandFunction: function (Bot, room, time, by, args, client) {
		Bot.say(room, `https://forms.gle/p1X6xLrxHvre1E1F9`);
	}
}