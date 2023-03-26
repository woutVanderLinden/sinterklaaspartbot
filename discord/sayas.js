module.exports = {
	help: `Says as () in ()`,
	admin: true,
	guildOnly: ['719076445699440700'],
	commandFunction: function (args, message, Bot) {
		args = args.join(' ').split(/,\s*/);
		if (!args.length) return message.channel.send(unxa);
		if (/^[a-zA-Z0-9]/.test(args[0])) args[0] = ' ' + args[0];
		// eslint-disable-next-line
		Bot.emit('chat', message.channel.name, Date.now(), args[0].trim().replace(/^[^\^$+%@*#&~]/, c => ' ' + c), args.slice(1).join(','));
	}
};
