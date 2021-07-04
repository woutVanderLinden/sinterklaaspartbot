module.exports = {
	cooldown: 10,
	help: `Does stuff.`,
	permissions: 'admin',
	commandFunction: function (Bot, room, time, by, args, client) {
		Bot.say(room, `${args[0] ? args.join(' ') : '/me does nothing'}`);
	}
}