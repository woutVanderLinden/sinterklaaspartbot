module.exports = {
	noDisplay: true,
	help: `Adds a user to a hosted raid.`,
	permissions: 'none',
	commandFunction: function (Bot, by, args, client) {
		const room = 'pokemongo';
		if (!Bot.rooms[room]?.users.some(u => toID(u) === toID(by))) return Bot.pm(by, '<<pokemongo>>');
		return Bot.commandHandler('removefromraid', by, args, room, true);
	}
}