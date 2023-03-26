module.exports = {
	cooldown: 100,
	help: `Whitelist... list?`,
	permissions: 'none',
	commandFunction: function (Bot, room, time, by, args, client) {
		const html = tools.listify(Bot.rooms[room]?.auth?.gamma.map(name => tools.colourize(name)));
		if (tools.hasPermission(by, 'gamma', room)) Bot.say(room, `/adduhtml APL,${html}`);
		else Bot.say(room, `/sendprivatehtmlbox ${by}, ${html}`);
	}
};
