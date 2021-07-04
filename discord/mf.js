module.exports = {
	help: `Toggles the MF role.`,
	guildOnly: "750048485721505852",
	commandFunction: function (args, message, Bot) {
		if (message.member.roles.cache.find(r => r.id==='750049107686457354')) message.member.roles.remove(message.guild.roles.cache.get("750049107686457354")).then(() => {
			message.channel.send('The MF role has been removed.');
		}).catch();
		else message.member.roles.add(message.guild.roles.cache.get("750049107686457354")).then(() => {
			message.channel.send('The MF role has been added.');
		}).catch();
	}
}