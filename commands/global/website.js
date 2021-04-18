module.exports = {
	cooldown: 1,
	help: `Displays the website link.`,
	permissions: 'none',
	commandFunction: function (Bot, room, time, by, args, client) {
		Bot.say(room, `/pm ${by},${websiteLink}`);
	}
}