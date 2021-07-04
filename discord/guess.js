const PZ = require('../data/PUZZLES/index.js');

module.exports = {
	help: `Makes a guess for an unlocked puzzle.`,
	guildOnly: PZ.guildID,
	commandFunction: function (args, message, Bot) {
		if (!PZ.live) return message.channel.send("Sorry, this command may not be used at this time. 'o.o");
		const team = PZ.getTeam(message.member);
		if (!team) return message.channel.send("You don't seem to be participating... maybe contact one of our staff?");
		if (team.channel !== message.channel.id) return message.channel.send("Please only use this in your own team's channel.").then(msg => {
			msg.delete({timeout: 3000});
			message.delete({timeout: 30});
		});
		if (!args.length) return message.channel.send("Which puzzle?");
		const cargs = args.join(' ').split(/\s*,\s*/);
		if (cargs.length < 2) return message.channel.send(`Unexpected number of arguments - the correct syntax is \`${prefix}guess (puzzle ID), (your guess)\``);
		const puzzle = PZ.getPuzzle(cargs.shift());
		const guess = cargs.join(',');
		if (!puzzle || !team.unlocked.includes(puzzle.index)) return message.channel.send("Puzzle not found.");
		PZ.guess(team, puzzle, guess).then(res => {
			if (res) {
				message.channel.send(`The correct answer was, indeed, ${puzzle.solution}!`);
				if (puzzle.index === "M") {
					message.channel.send(`**Congratulations! You have solved the metapuzzle!**`);
				}
				else {
					require('./puzzles.js').commandFunction([], message, Bot);
				}
			}
			else message.channel.send("Sorry, doesn't look like that was the answer...");
		}).catch(e => message.channel.send(e));
	}
}