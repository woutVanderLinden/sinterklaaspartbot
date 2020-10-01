module.exports = {
	help: `Mix 'n Mega command for Discord.`,
	guildOnly: ['713967096949768213', '747809518741618788', '652694230732636173'],
	commandFunction: function (args, message, Bot) {
		let [mon, stone] = args.join('').split('@');
		mon = toId(mon);
		stone = toId(stone);
		if (!data.pokedex[mon]) return message.channel.send('Unrecognized Pokemon.');
		if (!data.items[stone] || !data.items[stone].megaStone) return message.channel.send('Unrecognized stone.');
		let orStats = Object.assign({}, data.pokedex[mon].baseStats);
		let postStats = Object.assign({}, data.pokedex[toId(data.items[stone].megaStone)].baseStats);
		let preStats = Object.assign({}, data.pokedex[toId(data.items[stone].megaEvolves)].baseStats);
		let stats = [];
		Object.keys(orStats).forEach(stat => stats.push(orStats[stat] + postStats[stat] - preStats[stat]));
		let types = [[null, null], [null, null], [null, null], []];
		data.pokedex[mon].types.forEach((type, index) => {
			types[0][index] = type;
			types[3].push(type);
		});
		data.pokedex[toId(data.items[stone].megaEvolves)].types.forEach((type, index) => types[1][index] = type);
		data.pokedex[toId(data.items[stone].megaStone)].types.forEach((type, index) => types[2][index] = type);
		if (types[1].join('|') === types[2].join('|'));
		else if (!types[2][1] && types[1][1]) {
			if (types[0].length > 1) types[3][1] = null;
		}
		else if (types[2][1] && !types[1][1]) {
			if (!types[3].includes(types[2][1])) types[3][1] = types[2][1];
		}
		else if (types[2][1] && types[1][1]) {
			if (!types[3].includes(types[2][1])) types[3][1] = types[2][1];
		}
		else if (!types[2][1] && !types[1][1]) {
			if (!types[3].includes(types[2][0])) types[3][1] = types[2][0];
		}
		return message.channel.send('```\n' + ['HP', 'Atk', 'Def', 'SpA', 'SpD', 'Spe'].map((term, i) => term + ': ' + (stats[i] > 1 ? (stats[i] < 255 ? stats[i] : 255) : 1)).join(', ') + `\nAbility: ${data.pokedex[toId(data.items[stone].megaStone)].abilities['0']}\nTyping: ${types[3].filter(type => type).join(' / ')}\n` + '```');
	}
}
