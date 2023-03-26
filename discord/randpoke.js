module.exports = {
	help: `Random Pokemon! No filters work, but numbers do.`,
	pm: true,
	commandFunction: function (args, message, Bot) {
		let num = 1;
		if (!isNaN(parseInt(args.join('')))) num = parseInt(args.join(''));
		const mons = Object.values(data.pokedex).filter(m => {
			return m.num > 0 && !m.forme;
		}).map(m => m.name).random(num).join(', ');
		return message.channel.send('```' + mons + '```');
	}
};
