module.exports = {
	help: `Just use the buttons.`,
	noDisplay: true,
	permissions: 'none',
	commandFunction: function (Bot, by, args, client) {
		let crCom = require('../commands/global/lightsout.js').commandFunction;
		let room = args.shift();
		if (!room) return Bot.pm(by, unxa);
		room = room.replace(/[^0-9a-z-]/g,'');
		if (!Bot.rooms[room]) return Bot.pm(by, "Invalid room.");
		return crCom(Bot, room, Date.now(), by, args, client, true);
	}
}