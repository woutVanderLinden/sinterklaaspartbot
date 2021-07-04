module.exports = {
	help: `Analyzes a given hunt to return tags.`,
	permissions: 'coder',
	commandFunction: function (Bot, by, args, client) {
		if (!args[0]) return Bot.pm(by, unxa);
		let huntString = args.join(' ');
		let huntPromise = new Promise((resolve, reject) => {
			if (/pokepast\.es\/[a-z0-9]+(?:\/raw)?$/.test(huntString)) {
				if (!/^https?:\/\//.test(huntString)) huntString = 'http://' + huntString;
				if (!/\/raw$/.test(huntString)) huntString += '/raw';
				require('request')(huntString, (error, response, body) => {
					if (error) reject(error);
					return resolve(body);
				});
			}
			else if (/pastebin\.com\/(?:raw\/)?[a-zA-Z0-9]+$/.test(huntString)) {
				if (!/^https?:\/\//.test(huntString)) huntString = 'http://' + huntString;
				if (!/\/raw/.test(huntString)) huntString = 'http://pastebin.com/raw/' + huntString.split('.com/')[1];
				require('request')(huntString, (error, response, body) => {
					if (error) reject(error);
					return resolve(body);
				});
			}
			else if (/pastie\.io\/(?:raw\/)?[a-zA-Z0-9]+$/.test(huntString)) {
				if (!/^https?:\/\/pastie\.io\/(?:raw\/)?[a-zA-Z0-9]+$/.test(huntString)) huntString = 'http://' + huntString;
				if (!/\/raw/.test(huntString)) huntString = 'http://pastie.io/raw/' + huntString.split('.io/')[1];
				require('request')(huntString, (error, response, body) => {
					if (error) reject(error);
					return resolve(body);
				});
			}
			else return resolve(huntString);
		}).then(huntText => {
			let aHunt = huntText.replace(/^(?:\/scav queue .*?\|)? ?/, '').split('|');
			if (aHunt.length % 2) return Bot.pm(by, 'It appears that I found a question without an answer... :(');
			let hunt = [];
			while (aHunt.length) hunt.push({q: aHunt.shift().trim(), a: aHunt.shift().split(';').map(a => a.trim())});
			hunt.forEach(q => {
				q.tags = [];
				if (/\brde\b/i.test(q.q)) q.tags.push('RDE');
				if (/(?:\/n?ds)?.*?,/i.test(q.q) && /param(?:eter)?s/i.test(q.q)) q.tags.push('Params');
				else {
					let sp = q.q.split(', '), flag = true;
					sp[0] = sp[0].split(' ').pop();
					sp[sp.length - 1] = sp[sp.length - 1].split(' ').shift();
					sp.forEach(m => {
						if (!data.pokedex[toID(m)]) flag = false;
					});
					if (flag) q.tags.push('Params');
				}
				if (/(?:\[[^\[\]]*?\][^\+]*?){3,}/i.test(q.q)) q.tags.push('Port');
				else if (/(?:\[[^\[\]]*?\].*?\+.*?)+(?:\[[^\[\]]*?\]*?)/i.test(q.q)) q.tags.push('Psywave');
				if (/(?:^|[\.,] ?)(?:\s*?(?:this|these|what) .*?(?:Pok.mon)?(?: is| was| are| were| ha(?:s|d|ve)| g[oe]t| learn|\'s')|Name (?:the|all))/i.test(q.q)) q.tags.push('Trivia');
			});
			function formatter (q) {
				let out = {};
				out['Discord Spoiler Format'] = `${q.q} | ||${q.a}||`;
				out['Answerless Format'] = `${q.q} | REDACTED`;
				out['Tagged Full Format'] = `[${q.tags.length ? tools.listify(q.tags) : 'Unidentified'}] ${q.q} | ${q.a}`;
				return out;
			}
			let formatted = {};
			hunt.forEach(q => {
				let format = formatter(q);
				Object.keys(format).forEach(type => {
					if (!formatted[type]) formatted[type] = [];
					formatted[type].push(format[type]);
				});
			});
			Object.keys(formatted).forEach(type => formatted[type] = `/scav queue ${by.substr(1)} | ` + formatted[type].join(' | '));
			let html = [];
			let tags = Object.values(hunt).map(q => q.tags);
			html.push('<DETAILS><SUMMARY>Summary</SUMMARY><HR/>' + tags.map((q, i) => `Q${i + 1}) ${q.sort().join(', ')}`).join('<BR/>') + '</DETAILS><HR/>');
			Object.keys(formatted).forEach(type => html.push(`<DETAILS><SUMMARY>${type}</SUMMARY><HR/>${formatted[type]}</DETAILS>`));
			html = html.join('<BR/>');
			return Bot.sendHTML(by, html);
		}).catch(error => {
			if (error) return Bot.pm(by, 'Invalid link!');
		});
	}
}