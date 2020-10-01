module.exports = {
	help: `Deletes the cache for a command.`,
	admin: true,
	commandFunction: function (args, message, Bot) {
		if (!args.length) return message.channel.send(unxa).then(msg => msg.delete({timeout: 3000}));
		let command = toId(args.join(''));
		command = require('../data/ALIASES/discord.json')[command] || command;
		if (!fs.readdirSync(`./discord`).includes(command + '.js')) return message.channel.send("Not found.");
		delete require.cache[require.resolve(`./${command}.js`)];
		message.channel.send(`Reloaded ${command}.`);
		Bot.log(`${message.author.username} reloaded ${command}.`);
	}
}
