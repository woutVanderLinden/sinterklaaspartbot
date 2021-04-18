module.exports = {
	cooldown: 0,
	help: `Testing stuff.`,
	permissions: 'coder',
	commandFunction: function (Bot, room, time, by, args, client) {
		Bot.say(room, 'Testing go brr');
		return;
	}
}