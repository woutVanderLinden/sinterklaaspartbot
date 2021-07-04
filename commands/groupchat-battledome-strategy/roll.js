module.exports = {
	cooldown: 1,
	help: `Rolls stuff.`,
	permissions: 'none',
	commandFunction: function (Bot, room, time, by, args, client) {
		Bot.say(room, `${tools.hasPermission(by,'gamma') ? `!roll ${args.length ? args.join(' ') : '20'}` : `/w ${by},!roll ${args.length ? args.join(' ') : '20'}`}`);
	}
}