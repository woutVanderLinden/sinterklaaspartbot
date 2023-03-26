const PZ = require('../data/PUZZLES/index.js');

module.exports = {
	help: `Displays a list of usable commands.`,
	admin: true,
	guildOnly: PZ.guildID,
	commandFunction: function (args, message, Bot) {
		delete require.cache[require.resolve('../data/PUZZLES/index.js')];
		const PZ = require('../data/PUZZLES/index.js');
		message.channel.send("The Puzzles module has been reloaded.");
	}
};
