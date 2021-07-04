module.exports = {
	help: `Displays the available ports for a term.`,
	permissions: 'coder',
	commandFunction: function (Bot, by, args, client) {
		if (!args.length) return Bot.pm(by, 'Uhh, what ports should I get?');
		let sources = Object.values(data.pokedex).map(m => m.name);
		let terms = args.join(' ').split(/,/), term = toID(terms.shift());
		let out = tools.getPorts(term, sources);
		let front = `<details><summary>Front</summary><hr/>`;
		try {
			let fc = terms.length ? terms.join(',') : 'true;';
			if (!fc.includes('return ')) fc = 'return ' + fc;
			let func = new Function(`return function (m, dex) {${fc}}`)();
			front += out[0].filter(m => func(data.pokedex[toID(m)], data.pokedex)).join('<br/>') || 'None.';
		} catch (e) {
			Bot.log(e);
			return Bot.pm(by, e.message);
		}
		front += '<hr/></details>';
		let end = `<details><summary>End</summary><hr/>`;
		try {
			let fc = terms.length ? terms.join(',') : 'true;';
			if (!fc.includes('return ')) fc = 'return ' + fc;
			let func = new Function(`return function (m, dex) {${fc}}`)();
			end += out[1].filter(m => func(data.pokedex[toID(m)], data.pokedex)).join('<br/>') || 'None.';
		} catch (e) {
			Bot.log(e);
			return Bot.pm(by, e.message);
		}
		end += '<hr/></details>';
		return Bot.sendHTML(by, front + '<br/>' + end);
	}
}