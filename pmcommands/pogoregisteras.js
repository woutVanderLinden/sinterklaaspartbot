module.exports = {
	noDisplay: true,
	help: `Registers someone on PoGo`,
	permissions: 'none',
	commandFunction: function (Bot, by, args, client) {
		const room = 'pokemongo';
		if (!Bot.rooms[room]?.users.some(u => toID(u) === toID(by))) return Bot.pm(by, '<<pokemongo>>');
		if (!tools.hasPermission(by, 'gamma', room)) return Bot.pm(by, `OOH LOOK A WILD PANSEAR`);
		if (!args.length) return Bot.roomReply(room, by, `You kinda need to type in the name first...`);
		let isBy = ' ';
		args = args.join(' ').replace(/^[^,]*,/, m => {
			isBy += m.slice(0, -1).trim();
			return '';
		}).split(' ');
		return Bot.commandHandler('setuser', isBy, args, room, by);
	}
}