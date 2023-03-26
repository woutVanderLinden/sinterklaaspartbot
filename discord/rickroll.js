module.exports = {
	help: `Does stuff.`,
	pm: true,
	commandFunction: function (args, message, Bot) {
		return message.channel.send("https://www.youtube.com/watch?v=dQw4w9WgXcQ");
	}
};
