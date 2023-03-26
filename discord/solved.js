const PZ = require('../data/PUZZLES/index.js');

module.exports = {
	help: `Displays all the puzzles your team has solved.`,
	guildOnly: PZ.guildID,
	commandFunction: function (args, message, Bot) {
		if (!PZ.live) return message.channel.send("Sorry, this command may not be used at this time. 'o.o");
		const team = PZ.getTeam(message.channel.id), staff = message.channel.id === PZ.IDs.staffChannel;
		if (!team && !staff) return message.channel.send("You don't seem to be participating... maybe contact one of our staff?");
		const Discord = require('discord.js'), embed = new Discord.MessageEmbed();
		const list = staff ? require('../data/PUZZLES/puzzles.json').map(pzz => pzz.id) : team.unlocked;
		embed.setColor('#2ECC71');
		embed.setTitle(`Puzzles Solved`)
			.addFields(list.map(id => PZ.getPuzzle(id)).map(puzzle => ({
				name: `${puzzle.index}. ${puzzle.title}`,
				value: staff ? puzzle.solution : team.puzzles[puzzle.index] ? puzzle.solution : '? ? ?'
			})));
		message.channel.send(embed);
	}
};
