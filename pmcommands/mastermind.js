module.exports = {
	help: `Mastermind, the code-breaking game! Type \`\`${prefix}mastermind (room) guess (your guess; eg 5694)\`\` to make a guess. Rules: https://en.wikipedia.org/wiki/Mastermind_(board_game)`,
	noDisplay: true,
	permissions: 'none',
	commandFunction: function (Bot, by, args, client) {
		let crCom = require('../commands/global/mastermind.js').commandFunction;
		let room = args.shift();
		if (!room) return Bot.pm(by, unxa);
		room = room.replace(/[^0-9a-z-]/g,'');
		if (!Bot.rooms[room]) return Bot.pm(by, "Invalid room.");
		return crCom(Bot, room, Date.now(), by, args, client, true);
	}
}
