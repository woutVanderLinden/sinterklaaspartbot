module.exports = {
	help: `Links the Showdown damage calculator.`,
	pm: true,
	commandFunction: function (args, message, Bot) {
		return message.channel.send("https://calc.pokemonshowdown.com/");
	}
}
