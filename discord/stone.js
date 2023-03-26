module.exports = {
	help: `Displays the stats for a specified Mega Stone.`,
	guildOnly: ['713967096949768213', '747809518741618788', '887887985629073459'],
	commandFunction: function (args, message, Bot) {
		const stone = toID(args.join(''));
		if (!data.items[stone] || !data.items[stone].megaStone) return message.channel.send('Unrecognized stone.');
		const stats = Object.values(data.pokedex[toID(data.items[stone].megaStone)].baseStats).map((t, i) => {
			return t - Object.values(data.pokedex[toID(data.items[stone].megaEvolves)].baseStats)[i];
		});
		const statStr = ['HP', 'Atk', 'Def', 'SpA', 'SpD', 'Spe'].map((term, i) => term + ': ' + stats[i]).join(', ');
		return message.channel.send('```' + statStr + '```');
	}
};
