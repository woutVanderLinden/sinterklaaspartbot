module.exports = {
	cooldown: 1000,
	help: `Filters through all Pokemon names using RegExp. Tutorial: https://regexone.com/lesson/introduction_abcs`,
	permissions: 'none',
	commandFunction: function (Bot, by, args, client) {
		let regex;
		try {
			regex = new RegExp(args.join(' ').trim(), 'i');
			let out = Object.keys(data.pokedex).filter(m => data.pokedex[m].num > 0 && regex.test(m));
			if (!out.length) return Bot.pm(by, 'None.');
			return Bot.sendHTML(by, `<DETAILS style="font-family:\'Arial\',monospace;"><SUMMARY>Results (${out.length})</SUMMARY>` + out.map(m => data.pokedex[m].name).sort().join('<BR>') + '</DETAILS>');
		} catch (e) {
			Bot.pm(by, e.message);
		}
	}
}