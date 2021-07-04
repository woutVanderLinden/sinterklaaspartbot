module.exports = {
	help: `Toggles the ME role.`,
	guildOnly: "750048485721505852",
	commandFunction: function (args, message, Bot) {
		if (message.member.roles.cache.find(r => r.id==='750049070206419055')) message.member.roles.remove(message.guild.roles.cache.get("750049070206419055")).then(() => {
			message.channel.send('The ME role has been removed.');
		}).catch(Bot.log);
		else message.member.roles.add(message.guild.roles.cache.get("750049070206419055")).then(() => {
			message.channel.send('The ME role has been added.');
		}).catch(Bot.log);
	}
}