const PZ = require('../data/PUZZLES/index.js');

module.exports = {
	help: `Displays the status of each team.`,
	guildOnly: PZ.guildID,
	commandFunction: function (args, message, Bot) {
		if (!message.member.roles.cache.has(PZ.IDs.staff)) {
			return message.channel.send('Access denied.').then(msg => msg.delete({ timeout: 3000 }));
		}
		const Discord = require('discord.js'), embed = new Discord.MessageEmbed();
		const input = toID(args.join(''));
		embed
			.setColor('#1ABC9C')
			.setTitle('Puzzles Completed')
			.addFields((input ? [args.join(' ').trim()] : PZ.allTeams().map(t => PZ.getTeam(t))).map(t => ({
				name: t.name,
				value: Object.keys(t.puzzles).filter(pzz => t.puzzles[pzz]).join(', ').trim() || '-'
			})));
		message.channel.send(embed);
	}
};
