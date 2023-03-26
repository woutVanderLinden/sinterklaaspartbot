const PZ = require('../data/PUZZLES/index.js');

module.exports = {
	help: `Adds a hint to the specified team.`,
	guildOnly: PZ.guildID,
	commandFunction: function (args, message, Bot) {
		if (!message.member.roles.cache.has(PZ.IDs.staff)) {
			return message.channel.send('Access denied.').then(msg => msg.delete({ timeout: 3000 }));
		}
		if (!args.length) return message.channel.send("Which team?");
		const team = PZ.getTeam(toID(args.join('')));
		if (!team) return message.channel.send("Couldn't get the team you meant.");
		PZ.addHints(team, 1).then(nam => {
			message.channel.send(`Hint refunded! ${team.name} now has ${nam} hint(s).`);
		}).catch(e => Bot.log(e));
	}
};
