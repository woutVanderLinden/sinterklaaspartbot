module.exports = {
	help: `Lists non-Player / Staff users in the HPL guild.`,
	admin: true,
	guildOnly: '729992843925520474',
	commandFunction: function (args, message, Bot) {
		message.channel.send(message.guild.members.cache.filter(user => !user.roles.cache.has('729994253865844806') && !user.roles.cache.has('729994343385137154')).map(u => '<@' + u.user.id + '>').join(', '));
	}
}