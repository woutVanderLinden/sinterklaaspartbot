module.exports = {
	help: `Does stuff.`,
	admin: true,
	pm: true,
	commandFunction: function (args, message, Bot) {
		message.channel.send(args.join(' '));
		message.delete();
	}
}
