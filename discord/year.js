module.exports = {
	help: `Sets your year.`,
	guildOnly: '750048485721505852',
	commandFunction: function (args, message, Bot) {
		const roles = [
			'-',
			'750048686675066921',
			'750048637051994172',
			'750048735509348372',
			'750048789221474476',
			'750064954907820175'
		];
		const year = ~~toID(args.join(''));
		if (!year || year > 5) return message.channel.send('Sorry, I only support years 1-5');
		const role = message.guild.roles.cache.find(r => r.id === roles[year]);
		Promise.all(Array.from({ length: 5 }).map((t, i) => {
			return message.member.roles.remove(message.guild.roles.cache.find(r => r.id === roles[i + 1]));
		})).then(() => {
			message.member.roles.add(role).then(() => {
				message.channel.send(`Your year has been set to ${year}.`);
			});
		});
	}
};
