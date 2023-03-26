module.exports = {
	help: `Toggles the Litwick role.`,
	guildOnly: "854760340159070210",
	commandFunction: function (args, message, Bot) {
		if (message.member.roles.cache.find(r => r.id === '854767136077250561')) {
			message.member.roles.remove(message.guild.roles.cache.get("854767136077250561")).then(() => {
				message.channel.send('o/, former Litwick.');
			}).catch(Bot.log);
		} else message.member.roles.add(message.guild.roles.cache.get("854767136077250561")).then(() => {
			message.channel.send('Welcome to the Litwick!');
		}).catch(Bot.log);
	}
};
