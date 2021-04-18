module.exports = {
	help: `Hotpatches stuff.`,
	admin: true,
	commandFunction: function (args, message, Bot) {
		if (!args.length) return message.channel.send(unxa).then(msg => msg.delete({timeout: 3000}));
		Bot.hotpatch(args.join(' '), by).then(out => message.channel.send(`Successfully hotpatched: ${out}.`)).catch(e => message.channel.send(`Hotpatch failed: ${e}`));
	}
}