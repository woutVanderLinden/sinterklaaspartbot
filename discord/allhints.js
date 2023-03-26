const PZ = require('../data/PUZZLES/index.js');

module.exports = {
	help: `Displays all the hints left with each team.`,
	guildOnly: PZ.guildID,
	commandFunction: function (args, message, Bot) {
		if (!message.member.roles.cache.has(PZ.IDs.staff)) {
			return message.channel.send('Access denied.').then(msg => msg.delete({ timeout: 3000 }));
		}
		const Discord = require('discord.js'), embed = new Discord.MessageEmbed();
		embed.setColor('#F1C40F').setTitle('Hints Remaining').addFields(PZ.allTeams().map(team => PZ.getTeam(team)).map(team => {
			return {
				name: team.name,
				value: team.hints
			};
		}));
		message.channel.send(embed);
	}
};
