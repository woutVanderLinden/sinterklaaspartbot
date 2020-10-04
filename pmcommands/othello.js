module.exports = {
	help: `The Othello module. You'll need a chatroom for this.`,
	noDisplay: true,
	permissions: 'none',
	commandFunction: function (Bot, by, args, client) {
		let oCom = require('../commands/global/othello.js').commandFunction;
		let room = args.shift();
		if (!room) return Bot.pm(by, unxa);
		room = room.replace(/[^0-9a-z-]/g,'');
		if (!Bot.rooms[room]) return Bot.pm(by, "Invalid room.");
		return oCom(Bot, room, Date.now(), by, args, client, true);
	}
}