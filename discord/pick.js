module.exports = {
	help: `Picks stuff.`,
	pm: true,
	commandFunction: function (args, message, Bot) {
		let cargs = args.join(' ').split(/\s*,\s*/);
		return message.channel.send(`I randomly picked: ${cargs.random().replace(/@everyone/g, '@ everyone')}`);
	}
}