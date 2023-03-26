module.exports = {
	help: `Speaks.`,
	admin: true,
	guildOnly: ['719076445699440700'],
	commandFunction: function (args, message, Bot) {
		const content = args.join(' ');
		// eslint-disable-next-line
		Bot.say(message.channel.name, `/adduhtml pbspeaks${Date.now()},${tools.quoteParse(`[00:00:00] +PartMan: ${content}`)}<div style="margin-bottom:0;padding-bottom:0;position:relative;top:-17px;float:right;color:gray;font-size:0.8em;height:0px;" null="></div>"`);
	}
};
