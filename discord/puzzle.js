const PZ = require('../data/PUZZLES/index.js');

module.exports = {
	help: `Displays a puzzle.`,
	guildOnly: PZ.guildID,
	commandFunction: function (args, message, Bot) {
		if (!PZ.live && message.channel.id !== PZ.IDs.staffChannel) return message.channel.send("Sorry, this command may not be used at this time. 'o.o");
		const team = PZ.getTeam(message.channel.id);
		if (!team && ![/* PZ.finishChannel, */PZ.IDs.staffChannel].includes(message.channel.id)) return message.channel.send("Can't be used here.");
		if (!args.length) return message.channel.send("Which puzzle?");
		const puzzle = PZ.getPuzzle(toID(args.join('')));
		if (!puzzle || (team && !team.unlocked.includes(puzzle.index))) return message.channel.send("Puzzle not found.");
		message.channel.send(PZ.displayPuzzle(puzzle.id));
	}
}