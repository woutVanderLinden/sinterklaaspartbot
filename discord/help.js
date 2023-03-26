module.exports = {
	// eslint-disable-next-line max-len
	help: `Displays the help for various commands. To view all commands, use \`${prefix}commands\` (in progress). To view information on a specific command, use \`${prefix}help (command name)\``,
	pm: true,
	commandFunction: function (args, message, Bot) {
		const PZ = require('../data/PUZZLES/index.js');
		if (message.guild.id === PZ.guildID) return require('./puzzlehelp.js').commandFunction(args, message, Bot);
		return message.channel.send(`Hi, sorry, this is in progress`);
	}
};
