const PZ = require('../data/PUZZLES/index.js');

module.exports = {
	help: `Uses a hint for a puzzle.`,
	guildOnly: PZ.guildID,
	commandFunction: function (args, message, Bot) {
		if (!PZ.live) return message.channel.send("Sorry, this command may not be used at this time. 'o.o");
		const team = PZ.getTeam(message.member);
		if (!team) return message.channel.send("You don't seem to be participating... maybe contact one of our staff?");
		if (team.channel !== message.channel.id) return message.channel.send("Please only use this in your own team's channel.").then(msg => {
			msg.delete({timeout: 3000});
			message.delete({timeout: 3000});
		});
		if (!args.length) return message.channel.send("Which puzzle?");
		const puzzle = PZ.getPuzzle(toID(args.join('')));
		if (!puzzle || !team.unlocked.includes(puzzle.index)) return message.channel.send("Puzzle not found.");
		if (!team.hints) return message.channel.send("Sorry, but it doesn't look like you have any available hints!");
		if (team.puzzles[puzzle.index]) return message.channel.send(`Here's a hint - you've solved it!`);
		message.channel.send('Hint request has been commenced. Please type \'confirm\' within the next minute to confirm.');
		message.channel.awaitMessages(msg => /confirm/i.test(msg.content) && msg.author.id === message.author.id, {max: 1, time: 60000, errors: ['time']}).then(col => {
			message.channel.send('Noted; a staff member will be here as soon as they can.');
			PZ.hintChannel.send(`<@&${PZ.IDs.staff}>: A hint has been requested in <#${team.channel}>.\n\nRemember to react with :thumbsup: if you're handling it.`);
			PZ.addHints(team, -1, false);
		}).catch(e => {
			message.channel.send("The hint usage has not been confirmed in time, and has been cancelled. A hint will not be consumed.");
		});
	}
}