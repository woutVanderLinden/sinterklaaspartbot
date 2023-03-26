module.exports = {
	help: `Adds the Nerd role.`,
	guildOnly: "750048485721505852",
	commandFunction: function (args, message, Bot) {
		if (!message.member.roles.cache.find(r => r.id === "771591913332539414")) {
			return message.channel.send("Permission denied.").then(msg => message.delete() && msg.delete({ timeout: 3000 }));
		}
		if (!message.mentions.users.size) {
			return message.channel.send("Who?").then(msg => message.delete() && msg.delete({ timeout: 3000 }));
		}
		const newUser = message.guild.members.cache.find(mem => mem.id === message.mentions.users.first().id);
		Bot.log(message.author.username + ' > ' + message.mentions.users.first().username);
		newUser.roles.add(message.guild.roles.cache.get("771591913332539414")).then(() => {
			message.delete({ timeout: 100 }).then(() => {
				message.channel.send("Added.").then(msg => msg.delete({ timeout: 3000 }));
			});
		}).catch(Bot.log);
	}
};
