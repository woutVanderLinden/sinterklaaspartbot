module.exports = {
	cooldown: 10,
	help: `Leaves a room`,
	permissions: 'coder',
	commandFunction: function (Bot, room, time, by, args, client) {
		Bot.say(room, `/me pouts\n/part`);
	}
}