module.exports = {
	help: `Generates a port with a given length. Defaults to 6 terms.`,
	permissions: 'coder',
	commandFunction: function (Bot, by, args, client) {
		let num = parseInt(args.join('').replace(/[^0-9]/g, ''));
		if (isNaN(num) || num < 2) num = 6;
		let toWord = {};
		Object.values(data.pokedex).forEach(term => toWord[toID(term.name)] = term.name);
		Object.values(data.moves).forEach(term => toWord[toID(term.name)] = term.name);
		Object.values(data.items).map(term => term.name.endsWith(' Berry') ? term.name.substr(0, term.name.length - 6) : term.name).forEach(term => toWord[toID(term)] = term);
		data.abilities.forEach(term => toWord[toID(term)] = term);
		let words = Object.keys(toWord);
		let port = [words.random()];
		let i = 0;
		while (++i < num) {
			let terms = tools.getPorts(port[port.length - 1], words)[1];
			if (terms.length == 1) {
				Bot.log("Backtracked: " + port.pop());
				// port.pop();
				i--;
				if (!port.length) port.push(words.random());
				continue;
			}
			let term;
			while (!term || term === port[port.length - 1]) term = terms.random();
			port.push(term);
		}
		port = port.map(term => toWord[term]);
		let text = port.join(', ');
		if (text.length < 250) return Bot.pm(by, text);
		else tools.uploadToPastie(text, url => Bot.pm(by, url));
	}
}