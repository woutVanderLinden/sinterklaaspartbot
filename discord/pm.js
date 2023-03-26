module.exports = {
	help: `PMs () ()`,
	admin: true,
	guildOnly: ['719076445699440700'],
	commandFunction: function (args, message, Bot) {
		args = args.join(' ').split(/,/);
		if (!args.length) return message.channel.send(unxa);
		Bot.pm(args[0], args.slice(1).join(','));
	}
};
