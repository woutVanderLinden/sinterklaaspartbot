const PZ = require('../data/PUZZLES/index.js');

module.exports = {
	help: `Adds the specified number of hints to the specified team.`,
	guildOnly: PZ.guildID,
	commandFunction: function (args, message, Bot) {
		if (!message.member.roles.cache.has(PZ.IDs.staff)) {
			return message.channel.send('Access denied.').then(msg => msg.delete({ timeout: 3000 }));
		}
		if (!args.length) return message.channel.send("Which team?");
		const cargs = args.join(' ').split(',');
		if (!cargs[1]) return message.channel.send("How many? (negative numbers work)");
		const team = PZ.getTeam(toID(cargs.shift())), amt = parseInt(cargs.join('').replace(/[^0-9-]/g, ''));
		if (!team) return message.channel.send("Couldn't get the team you meant.");
		if (typeof amt !== 'number') return message.channel.send("Invalid amount.");
		if (!amt) return message.channel.send('> add 0 hints');
		PZ.addHints(team, amt)
			.then(nam => message.channel.send(`${amt} hint(s) added! ${team.name} now has ${nam} hint(s).`))
			.catch(e => Bot.log(e));
	}
};
