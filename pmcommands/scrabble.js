module.exports = {
	help: `The Scrabble module. Use \`\`play (room) (start) (down/right) (word)\`\` to play.`,
	noDisplay: true,
	permissions: 'none',
	commandFunction: function (Bot, by, args, client) {
		let room = args.shift();
		if (!room) return Bot.pm(by, unxa);
		room = room.replace(/[^0-9a-z-]/g,'');
		if (!Bot.rooms[room]) return Bot.pm(by, "Invalid room.");
		return Bot.commandHandler('scrabble', by, args, room, true);
	}
}