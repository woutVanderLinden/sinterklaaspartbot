module.exports = {
	help: `Does stuff.`,
	pm: true,
	commandFunction: function (args, message, Bot) {
		return message.channel.send("https://www.smogon.com/forums/threads/1v1-swsh-speed-tiers.3657365/");
	}
}