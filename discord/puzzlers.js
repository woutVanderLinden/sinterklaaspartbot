const PZ = require('../data/PUZZLES/index.js');

module.exports = {
	help: `Displays the status of each team.`,
	guildOnly: PZ.guildID,
	commandFunction: function (args, message, Bot) {
		if (!message.member.roles.cache.has(PZ.IDs.staff)) return message.channel.send('Access denied.').then(msg => msg.delete({timeout: 3000}));
		const Discord = require('discord.js'), embed = new Discord.MessageEmbed();
		embed.setColor('#1ABC9C').setTitle('Puzzles Completed').addFields((toID(args.join('')) ? [args.join(' ').trim()] : PZ.allTeams()).map(team => PZ.getTeam(team)).map(team => {
			return {
				name: team.name,
				value: Object.keys(team.puzzles).filter(pzz => team.puzzles[pzz]).join(', ').trim() || '-'
			}
		}));
		message.channel.send(embed);
	}
}