module.exports = {
	help: `Lists the users in a room.`,
	admin: true,
	guildOnly: ['719076445699440700'],
	commandFunction: function (args, message, Bot) {
		if (!Bot.rooms[message.channel.name]) return message.channel.send('Not in this room. ;-;');
		message.channel.send(`\`\`\`${Bot.rooms[message.channel.name].users.join(', ')}\`\`\``);
	}
};
