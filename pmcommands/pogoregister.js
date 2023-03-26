module.exports = {
	noDisplay: true,
	help: `Registers you on PoGo`,
	permissions: 'none',
	commandFunction: function (Bot, by, args, client) {
		const room = 'pokemongo';
		if (!Bot.rooms[room]?.users.some(u => toID(u) === toID(by))) return Bot.pm(by, '<<pokemongo>>');
		return Bot.commandHandler('setuser', by, args, room, by);
	}
};
