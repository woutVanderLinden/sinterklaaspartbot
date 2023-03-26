module.exports = {
	help: `Displays a list of people looking for a specific raid in Pokemon GO.`,
	permissions: 'none',
	commandFunction: function (Bot, by, args, client) {
		let room = 'pokemongo';
		room = tools.getRoom(room);
		if (!Bot.rooms[room]) return Bot.pm(by, "Uhh I'm not in the Pokemon GO room, message me in a bit");
		return Bot.commandHandler('wishlist', by, args, room, true);
	}
};
