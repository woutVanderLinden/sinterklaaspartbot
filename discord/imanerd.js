module.exports = {
	help: `Adds the Nerd role.`,
	guildOnly: "750048485721505852",
	commandFunction: function (args, message, Bot) {
		return message.channel.send("Hi, nerd!").then(msg => msg.delete({timeout: 3000}));
		Bot.log(message.author.username);
		message.member.roles.add(message.guild.roles.cache.get("771591913332539414")).then(() => {
			message.delete({timeout: 100}).then(() => {
				message.channel.send("Added.").then(msg => msg.delete({timeout: 3000}));
			})
		}).catch(Bot.log);
	}
}