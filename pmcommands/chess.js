module.exports = {
	help: `The Chess module. Use \`\`play (room) (position)-(position)\`\` to play.`,
	noDisplay: true,
	permissions: 'none',
	commandFunction: function (Bot, by, args, client) {
		let chessCom = require('../commands/global/chess.js').commandFunction;
		let room = args.shift();
		if (!room) return Bot.pm(by, unxa);
		room = room.replace(/[^0-9a-z-]/g,'');
		if (!Bot.rooms[room]) return Bot.pm(by, "Invalid room.");
		return chessCom(Bot, room, Date.now(), by, args, client, true);
	}
}
