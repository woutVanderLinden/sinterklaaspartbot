module.exports = {
	help: `Raid hundos in PoGO`,
	noDisplay: true,
	permissions: 'none',
	commandFunction: function (Bot, by, args, client) {
		let room = 'pokemongo';
		room = tools.getRoom(room);
		if (!Bot.rooms[room]) return Bot.pm(by, "Uhh I'm not in the room, message me in a bit");
		return Bot.commandHandler('hundos', by, args, room, true);
	}
}
