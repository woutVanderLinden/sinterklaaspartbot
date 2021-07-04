module.exports = {
	help: `Raid guide - using me!`,
	permissions: 'none',
	commandFunction: function (Bot, by, args, client) {
		const room = 'pokemongo';
		if (!Bot.rooms[room]?.users.some(u => toID(u) === toID(by))) return Bot.pm(by, '<<pokemongo>>');
		return Bot.commandHandler('raidhelp', by, args, room, args.length ? true : by);
	}
}