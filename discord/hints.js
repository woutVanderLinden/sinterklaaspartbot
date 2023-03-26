const PZ = require('../data/PUZZLES/index.js');

module.exports = {
	help: `Displays the available number of hints.`,
	guildOnly: PZ.guildID,
	commandFunction: function (args, message, Bot) {
		if (!PZ.live) return message.channel.send("Sorry, this command may not be used at this time. 'o.o");
		const team = PZ.getTeam(message.member);
		if (!team) return message.channel.send("You don't seem to be participating... maybe contact one of our staff?");
		if (team.channel !== message.channel.id) {
			return message.channel.send("Please only use this in your own team's channel.").then(msg => {
				msg.delete({ timeout: 3000 });
				message.delete({ timeout: 3000 });
			});
		}
		const Discord = require('discord.js'), embed = new Discord.MessageEmbed();
		embed.addField('Hints available:', team.hints).setColor('#F1C40F');
		message.channel.send(embed);
	}
};
