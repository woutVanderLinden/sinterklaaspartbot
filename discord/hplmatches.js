module.exports = {
	help: `Aapko HPL Matches ka role deta / nikaalta hai.`,
	guildOnly: "729992843925520474",
	commandFunction: function (args, message, Bot) {
		// Bot.log(message.guild.roles.cache.get("739100021970174070"));
		const matchesRole = '854676701208641556';
		if (message.member.roles.cache.find(r => r.id === matchesRole)) message.member.roles.remove(message.guild.roles.cache.get(matchesRole)).then(() => {
			message.channel.send('Aapko ab matches pe notifications nahi milenge.');
		}).catch(Bot.log);
		else message.member.roles.add(message.guild.roles.cache.get(matchesRole)).then(() => {
			message.channel.send('Aapko ab matches pe notifications milenge.');
		}).catch(Bot.log);
	}
}