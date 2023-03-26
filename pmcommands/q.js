module.exports = {
	help: `Quotes! Use \`\`${prefix}q room | command\`\`. For a list of subcommands, use \`\`${prefix}q help\`\``,
	permissions: 'none',
	commandFunction: function (Bot, by, args, client) {
		if (['m', 'room'].includes((args[0] || '').toLowerCase())) args.shift();
		let [room, ctx] = args.join(' ').splitFirst('|').map(t => t.trim());
		room = tools.getRoom(room);
		if (['h', 'help'].includes(room)) [room, ctx] = ['botdevelopment', 'help'];
		if (!room) {
			let rooms = Bot.getRooms(by);
			if (!rooms) rooms = [];
			rooms = rooms.filter(r => Bot.rooms[r]);
			if (rooms.length === 0) return Bot.pm(by, "You don't know any of my rooms...");
			if (rooms.length === 1) room = rooms[0];
			// eslint-disable-next-line max-len
			else return Bot.sendHTML(by, `We share multiple rooms! Which did you mean?<br>` + rooms.map(r => `<button name="send" value="/msg ${Bot.status.nickName},${prefix}q ${Bot.rooms[r]?.title || r} | random">${Bot.rooms[r].title}</button>`));
		}
		if (!room || !Bot.rooms[room]) {
			// eslint-disable-next-line max-len
			return Bot.pm(by, `Invalid room. The syntax for this was recently changed; consult \`\`${prefix}help q\`\` for more details.`);
		}
		return Bot.commandHandler('q', by, ctx?.split(' ') || [], room, true);
	}
};
