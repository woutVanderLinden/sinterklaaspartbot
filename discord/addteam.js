const PZ = require('../data/PUZZLES/index.js');

module.exports = {
	help: `Adds a team to the hunt.`,
	guildOnly: PZ.guildID,
	commandFunction: function (args, message, Bot) {
		if (!message.member.roles.cache.has(PZ.IDs.staff)) return message.channel.send('Access denied.').then(msg => msg.delete({timeout: 3000}));
		if (!args.length) return message.channel.send("What's the team called?");
		PZ.addTeam(message, args.join(' ').split(',').shift().trim());
	}
}