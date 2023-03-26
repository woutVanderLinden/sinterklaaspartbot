module.exports = {
	cooldown: 2000,
	help: `Displays the content of a supplied pokepast.es link.`,
	permissions: 'gamma',
	commandFunction: function (Bot, room, time, by, args, client) {
		if (!args[0]) return Bot.say(room, unxa);
		link = args.join(' ');
		if (!/^https?:\/\/pokepast\.es\/[0-9a-z]+(?:\/json)?$/.test(link)) return Bot.say(room, 'Not a valid paste.');
		require('request')(link.endsWith('/json') ? link : link + '/json', (error, response, body) => {
			if (error) return;
			let obj;
			try {
				obj = JSON.parse(body);
			} catch (e) {
				return Bot.pm(by, 'Invalid paste.');
			}
			let pkmn = obj.paste.match(/(?:^|\r?\n\r?\n)([^\r\n]*?)\r?\n/g);
			if (!pkmn) return;
			pkmn = pkmn
				.map(m => {
					m = m.trim();
					const l = m.match(/\([^\(\)]+\)/g);
					if (!l) return m.split('@')[0].trim();
					else if (l.length === 2) return m.match(/\(.*?\)/)[0].substr(1).slice(0, -1);
					else if (l.length === 1 && /\([MF]\)/.test(m)) return m.split(/\([MF]\)/)[0].trim();
					else if (l.length === 1) return m.match(/\(.*?\)/)[0].substr(1).slice(0, -1);
					else return m.split('@')[0].trim();
				})
				.map(m => m.toLowerCase().replace(/[^a-z0-9-]/g, ''))
				.filter(m => data.pokedex[toID(m)] || data.pokedex[m.split('-')[0]])
				.map(m => data.pokedex[toID(m)] ? toID(m) : m);
			pkmn = pkmn.map(m => `<psicon pokemon="${m}" style="veritcal-align: middle;">`).join('');
			// eslint-disable-next-line max-len
			Bot.say(room, '/adduhtml POKEPASTE,<details><summary>' + obj.title + ' &nbsp;[' + pkmn + ']</summary><hr><br>' + obj.paste.replace(/\n/g, '<br>') + '</details>');
		});
	}
};
