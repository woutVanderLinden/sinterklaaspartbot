module.exports = {
	help: `Displays the available ports for a term.`,
	permissions: 'coder',
	commandFunction: function (Bot, by, args, client) {
		if (!args.length) return Bot.pm(by, 'Uhh, what ports should I get?');
		let out = {};
		let sources = {
			"Pokemon": Object.values(data.pokedex).map(m => m.name),
			"Moves": Object.values(data.moves).map(m => m.name),
			"Items": Object.keys(data.items).map(i => i.name),
			"Abilities": data.abilities,
			"Locations": []
		}
		let term = toId(args.join(''));
		Object.keys(sources).forEach(type => out[type] = tools.getPorts(term, sources[type]));
		let front = `<DETAILS><SUMMARY>Front</SUMMARY><HR/>`;
		let types = Object.keys(out).filter(type => out[type][0] && out[type][0].length);
		types.forEach(type => front += `<DETAILS><SUMMARY>${type}</SUMMARY>${out[type][0].join('<BR/>')}<HR/></DETAILS>`);
		if (!types.length) front += 'None.';
		front += '<HR/></DETAILS>';
		let end = `<DETAILS><SUMMARY>End</SUMMARY><HR/>`;
		let eTypes = Object.keys(out).filter(type => out[type][1] && out[type][1].length);
		eTypes.forEach(type => end += `<DETAILS><SUMMARY>${type}</SUMMARY>${out[type][1].join('<BR/>')}<HR/></DETAILS>`);
		if (!eTypes.length) end += 'None.';
		end += '<HR/></DETAILS>';
		return Bot.sendHTML(by, front + '<BR/>' + end);
	}
}