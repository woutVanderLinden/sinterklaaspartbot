module.exports = {
	help: `Mutes the mentioned users`,
	guildOnly: "729992843925520474",
	commandFunction: function (args, message, Bot) {
		// Bot.log(message.guild.roles.cache.get("739100021970174070"));
		const staffRole = message.guild.roles.cache.find(role => role.name === 'Room Staff');
		if (!message.member.roles.cache.has(staffRole.id)) {
			return message.channel.send('Access denied.').then(msg => msg.delete({ timeout: 3000 }));
		}
		const muted = [], unmuted = [];
		const role = message.guild.roles.cache.find(role => role.name === 'Muted haha');
		const mentions = message.mentions.members;
		if (!mentions?.size) return message.channel.send(`Who do you want to (un)mute, though?`);
		mentions.forEach(member => {
			if (member.roles.cache.has(role.id)) {
				unmuted.push(member.id);
				member.roles.remove(role);
			} else {
				muted.push(member.id);
				member.roles.add(role);
			}
		});
		const embed = new Discord.MessageEmbed().setTitle('HPL');
		if (muted.length) embed.addField('Muted', tools.listify(muted.map(id => `<@${id}>`)));
		if (unmuted.length) embed.addField('Unmuted', tools.listify(unmuted.map(id => `<@${id}>`)));
		message.channel.send(embed);
	}
};
