module.exports = {
	help: `Does stuff.`,
	admin: true,
	commandFunction: function (args, message, Bot) {
		let name = args.join(' ').trim();
		let users = message.guild.members.cache.filter(m => m.displayName === name);
		if (!users.size) return message.channel.send("Couldn't find 'em.");
		return message.channel.send(users.map(user => `<@${user.user.id}>`).join(', '));
	}
}