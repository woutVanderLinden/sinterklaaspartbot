module.exports = {
	cooldown: 100,
	help: `Summarizes PS! battles.`,
	permissions: 'coder',
	commandFunction: function (Bot, room, time, by, args, client) {
		Bot.say(room, `BLANK`);
	}
}