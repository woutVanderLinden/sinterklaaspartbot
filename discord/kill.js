module.exports = {
	help: `Exits the process.`,
	admin: true,
	pm: true,
	commandFunction: function (args, message, Bot) {
		message.channel.send('o/').then(() => process.exit());
	}
}
