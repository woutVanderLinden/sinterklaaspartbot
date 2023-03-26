module.exports = {
	help: `Submits a challenge`,
	guildOnly: '',
	commandFunction: function (args, message, Bot) {
		const challenge = args.join(' ').replace(/@(?:everyone|here)/g, 'REDACTED PING');
		if (!challenge) return message.channel.send('Type your challenge info, too!').then(msg => msg.delete({ timeout: 3000 }));
		if (challenge.length > 1800) return message.channel.send('Type less stuff onegai').then(msg => msg.delete({ timeout: 3000 }));
		client.channels.cache.get(ID).send(`Challenge from <@${message.author.id}>:\n\n\`\`\`\n${challenge}\n\`\`\``);
		message.channel.send("It's been submitted!");
	}
};
