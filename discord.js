exports.handler = async message => {
	if (message.author.bot) return;
	if (!message.content.startsWith(prefix) && message.mentions && message.mentions.users && message.mentions.users.has('548451132180004884')) return message.channel.send(`Hi, I'm ${Bot.status.nickName}! I'm a bot by ${config.owner}. My command character is \`\`${prefix}\`\`.`);
	if (!message.content.startsWith(prefix)) return require('./discord_chat.js').handle(message, Bot);
	const admins = config.discordAdmins;
	let args = message.content.substr(prefix.length).split(' '), commandName = toId(args.shift());
	if (!commandName) return;
	commandName = require('./data/ALIASES/discord.json')[commandName] || commandName;
	try {
		if (['eval', 'output'].includes(commandName)) {
			if (!admins.includes(message.author.id)) return message.channel.send('ACCESS DENIED.').then(msg => msg.delete({timeout: 3000}));
			let output = eval(args.join(' '));
			switch (typeof output) {
				case 'object': output = require('util').inspect(output);
				case 'function': output = output.toString(); break;
			}
			return message.channel.send('```\n' + output + '```').catch(e => message.channel.send('```\n' + output.substr(0, 1970) + '```').catch(e => {
				message.channel.send(e.message);
				Bot.log(e);
			}));
		}
		let dir = fs.readdirSync('./discord');
		if (!dir.includes(commandName + '.js')) return message.channel.send("Doesn't look like that command exists...").then(msg => msg.delete({timeout: 3000}));
		let commandFile = require(`./discord/${commandName}.js`);
		if (commandFile.guildOnly &&
			!(Array.isArray(commandFile.guildOnly) && commandFile.guildOnly.includes(message.guild.id)) &&
			!(typeof commandFile.guildOnly === "string" && commandFile.guildOnly == message.guild.id)) return message.channel.send('Not meant to be used here.').then(msg => msg.delete({timeout: 3000}));
		else if (commandFile.admin && !admins.includes(message.author.id)) return message.channel.send('Access denied.').then(msg => msg.delete({timeout: 3000}));
		else if (message.type === 'dm') {
			if (!commandFile.pm) return message.channel.send("This command isn't available in DMs, sorry...").then(msg => msg.delete({timeout: 3000}));
			else if (typeof commandFile.pm === 'function') return commandFile.pm(args, message, Bot);
		}
		if (commandFile.pmOnly) return;
		else return commandFile.commandFunction(args, message, Bot);

	} catch (e) {
		message.channel.send(`Error: ${e.message}`);
		Bot.log(e);
	}
	return;
}
