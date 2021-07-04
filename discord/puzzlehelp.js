const PZ = require('../data/PUZZLES/index.js');

module.exports = {
	help: `Displays a list of usable commands.`,
	guildOnly: PZ.guildID,
	commandFunction: function (args, message, Bot) {
		message.channel.send(PZ.help(message.channel.id === PZ.IDs.staffChannel));
	}
}