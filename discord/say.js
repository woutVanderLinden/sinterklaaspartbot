module.exports = {
	help: `Does stuff.`,
	admin: true,
	pm: true,
	commandFunction: function (args, message, Bot) {
		if (message.guild.id === '719076445699440700') return Bot.say(message.channel.name, args.join(' '));
		message.channel.send(args.join(' '));
		message.delete();
	}
}