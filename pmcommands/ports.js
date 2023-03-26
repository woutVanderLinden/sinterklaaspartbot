module.exports = {
	help: `Displays the available ports for a term.`,
	permissions: 'coder',
	commandFunction: function (Bot, by, args, client) {
		if (!args.length) return Bot.pm(by, 'Uhh, what ports should I get?');
		const out = {};
		const sources = {
			"Pokemon": Object.values(data.pokedex).map(m => m.name),
			"Moves": Object.values(data.moves).map(m => m.name),
			"Items": Object.values(data.items).map(i => i.name).map(name => name.replace(/ Berry$/, '')),
			"Abilities": data.abilities,
			"Locations": []
		};
		const terms = args.join(' ').split(/\s*,\s*/), term = toID(terms.shift());
		Object.keys(sources).forEach(type => out[type] = tools.getPorts(term, sources[type]));
		let front = `<details><summary>Front</summary><hr>`;
		const types = Object.keys(out).filter(type => out[type][0] && out[type][0].length);
		types.forEach(type => front += `<details><summary>${type}</summary>${out[type][0].join('<br>')}<hr></details>`);
		if (!types.length) front += 'None.';
		front += '<hr></details>';
		let end = `<details><summary>End</summary><hr>`;
		const eTypes = Object.keys(out).filter(type => out[type][1] && out[type][1].length);
		eTypes.forEach(type => end += `<details><summary>${type}</summary>${out[type][1].join('<br>')}<hr></details>`);
		if (!eTypes.length) end += 'None.';
		end += '<hr></details>';
		return Bot.sendHTML(by, front + '<br>' + end);
	}
};
