module.exports = {
	help: `Displays the stats that a Mega stone grants.`,
	guildOnly: ['713967096949768213', '747809518741618788'],
	commandFunction: function (args, message, Bot) {
		let stone = toId(args.join(''));
		if (!data.items[stone] || !data.items[stone].megaStone) return message.channel.send("Unrecognized stone.");
		let stats = Object.values(data.pokedex[toId(data.items[stone].megaStone)].baseStats).map((t, i) => t - Object.values(data.pokedex[toId(data.items[stone].megaEvolves)].baseStats)[i]);
		return message.channel.send('```' + ['HP', 'Atk', 'Def', 'SpA', 'SpD', 'Spe'].map((term, i) => term + ': ' + stats[i]).join(', ') + '```');
	}
}
