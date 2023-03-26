module.exports = {
	cooldown: 1,
	help: `Rolls stuff.`,
	permissions: 'none',
	commandFunction: function (Bot, room, time, by, args, client) {
		const rollStr = `!roll ${args.length ? args.join(' ') : '20'}`;
		Bot.say(room, tools.hasPermission(by, 'gamma') ? rollStr : `/w ${by},${rollStr}`);
	}
};
