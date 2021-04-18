module.exports = {
	cooldown: 1,
	help: `HPL ke links darshata hai.`,
	permissions: 'none',
	commandFunction: function (Bot, room, time, by, args, client) {
		let text = `**HPL Finals!**: ${websiteLink}/hpl/week7`;
		if (tools.hasPermission(by, 'gamma', room)) return Bot.say(room, text);
		else Bot.pm(by, text);
	}
}