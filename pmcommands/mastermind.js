module.exports = {
	// eslint-disable-next-line max-len
	help: `Mastermind, the code-breaking game! Type \`\`${prefix}mastermind (room) guess (your guess; eg 5694)\`\` to make a guess. Rules: https://en.wikipedia.org/wiki/Mastermind_(board_game)`,
	noDisplay: true,
	permissions: 'none',
	commandFunction: function (Bot, by, args, client) {
		let room = args.shift();
		if (!room) return Bot.pm(by, unxa);
		room = tools.getRoom(room);
		if (!Bot.rooms[room]) return Bot.pm(by, "Invalid room.");
		return Bot.commandHandler('mastermind', by, args, room, true);
	}
};
