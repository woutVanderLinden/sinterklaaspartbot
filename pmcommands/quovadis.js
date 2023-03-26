module.exports = {
	help: `Use ${prefix}help quovadis in a chatroom for complete information.`,
	noDisplay: true,
	permissions: 'none',
	commandFunction: function (Bot, by, args, client) {
		if (!args.length) return;
		if (!args.shift().toLowerCase() === 'play') return;
		const arg = args.join(' ').split(/, */);
		let room = arg.shift();
		room = tools.getRoom(room);
		if (!Bot.rooms[room]) return Bot.pm(by, "Invalid room.");
		return Bot.commandHandler('quovadis', by, ['play'].concat(arg.join(', ').split(' ')), room, true);
	}
};
