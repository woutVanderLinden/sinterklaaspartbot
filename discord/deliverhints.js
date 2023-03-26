const PZ = require('../data/PUZZLES/index.js');

module.exports = {
	help: `Delivers a hint to every team.`,
	guildOnly: PZ.guildID,
	commandFunction: function (args, message, Bot) {
		if (!message.member.roles.cache.has(PZ.IDs.staff)) {
			return message.channel.send('Access denied.').then(msg => msg.delete({ timeout: 3000 }));
		}
		const amt = parseInt(args.join('').replace(/[^0-9-]/g, ''));
		if (typeof amt !== 'number') return message.channel.send("Invalid amount.");
		if (!amt) return message.channel.send('> add 0 hints');
		PZ.massHints(amt).then(() => {
			PZ.log(`${amt} hint(s) added to everyone!`);
			message.channel.send(`${amt} hint(s) added to everyone.`);
		}).catch(e => Bot.log(e));
	}
};
