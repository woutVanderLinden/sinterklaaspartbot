module.exports = {
	help: `Displays the help for various commands. To view all commands, use \`${prefix}commands\` (in progress). To view information on a specific command, use \`${prefix}help (command name)\``,
	pm: true,
	commandFunction: function (args, message, Bot) {
		return message.channel.send(`Hi, sorry, this is in progress`);
	}
}