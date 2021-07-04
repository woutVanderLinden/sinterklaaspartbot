module.exports = {
	help: `HELP`,
	guildOnly: ['713967096949768213', '747809518741618788'],
	commandFunction: function (args, message, Bot) {
		let stone = toID(args.join(''));
		if (!data.items[stone] || !data.items[stone].megaStone) return message.channel.send("Unrecognized stone.");
		let stats = Object.values(data.pokedex[toID(data.items[stone].megaStone)].baseStats).map((t, i) => t - Object.values(data.pokedex[toID(data.items[stone].megaEvolves)].baseStats)[i]);
		return message.channel.send('```' + ['HP', 'Atk', 'Def', 'SpA', 'SpD', 'Spe'].map((term, i) => term + ': ' + stats[i]).join(', ') + '```');
	}
}