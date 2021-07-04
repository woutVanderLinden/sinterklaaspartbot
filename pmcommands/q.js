module.exports = {
	help: `Quotes! n.n`,
	permissions: 'none',
	commandFunction: function (Bot, by, args, client) {
		args = args.join(' ').split(/,\s*/);
		let room = args[0].toLowerCase().replace(/[^a-z0-9-]/g, '');
		if (!room) {
			let rooms = Bot.getRooms(by);
			if (!rooms) rooms = [];
			rooms = rooms.filter(r => Bot.rooms[r]);
			if (rooms.length === 0) return Bot.pm(by, "You don't know any of my rooms...");
			if (rooms.length === 1) room = rooms[0];
			else return Bot.sendHTML(by, `Multiple rooms found! Which did you mean?<br>` + rooms.map(r => `<button name="send" value="/msg ${Bot.status.nickName},${prefix}q ${r}, random">${Bot.rooms[r].title}</button>`));
		}
		room = aliases[room] || room;
		if (!room || !Bot.rooms[room]) return Bot.pm(by, 'Invalid room.');
		return Bot.commandHandler('q', by, args[1] ? args[1].split(' ') : [], room, true);
	}
}