module.exports = {
	help: `Converts a given team from Pokepaste into the UTM format.`,
	pm: true,
	commandFunction: function (args, message, Bot) {
		if (!args.length) return message.channel.send(unxa);
		function parseMon (mon) {
			if (!mon.replace(/[^a-zA-Z0-9]/g, '')) return true;
			let out = {
				name: null,
				species: null,
				gender: null,
				level: 100,
				item: null,
				ability: null,
				shiny: false,
				happiness: 255,
				hiddenpower: null,
				evs: {
					hp: 0,
					atk: 0,
					def: 0,
					spa: 0,
					spd: 0,
					spe: 0
				},
				ivs: {
					hp: 31,
					atk: 31,
					def: 31,
					spa: 31,
					spd: 31,
					spe: 31
				},
				nature: 'Serious',
				moves: []
			}
			let lines = mon.split('\n').map(line => line.trim());
			let line = lines.shift().split(' @ ');
			if (line[1]) out.item = line[1];
			out.gender = line[0].match(/\([MF]\)$/);
			if (out.gender) {
				out.gender = out.gender[0][1];
				line[0] = line[0].slice(0, -4);
			}
			out.species = line[0].match(/\(.*\)/);
			if (out.species) out.species = toId(out.species[0].slice(1, -1));
			line[0] = line[0].replace(/\(.*\)/, '');
			out.name = line[0].trim();
			line = lines.shift().split('Ability: ');
			if (line.length !== 2) return null;
			out.ability = line[1].trim();
			line = lines.shift();
			if (line.startsWith('Level: ')) {
				out.level = parseInt(line.substr('Level: '.length).trim());
				if (isNaN(out.level)) return null;
				line = lines.shift();
			}
			if (line.startsWith('Shiny: ')) {
				out.shiny = true;
				line = lines.shift();
			}
			if (line.startsWith('Happiness: ')) {
				out.happiness = parseInt(line.substr('Happiness: '.length).trim());
				line = lines.shift();
			}
			if (line.startsWith('Hidden Power: ')) {
				out.happiness = line.substr('Hidden Power: '.length).trim();
				line = lines.shift();
			}
			if (line.startsWith('EVs: ')) {
				line.substr(5).split(' / ').forEach(stat => {
					stat = stat.split(' ');
					let val = parseInt(stat[0]);
					if (isNaN(val)) return null;
					out.evs[stat[1].toLowerCase()] = val;
				});
				line = lines.shift();
			}
			if (line.endsWith(' Nature')) {
				out.nature = line.split(' ')[0];
				line = lines.shift();
			}
			if (line.startsWith('IVs: ')) {
				line.substr(5).split(' / ').forEach(stat => {
					stat = stat.split(' ');
					let val = parseInt(stat[0]);
					if (isNaN(val)) return null;
					out.ivs[stat[1].toLowerCase()] = val;
				});
				line = lines.shift();
			}
			while (line && line.startsWith('- ')) {
				out.moves.push(line.substr(2));
				line = lines.shift();
			}
			return out;
		}
		function utm (text) {
			return text.split(/\n\s*\n/).map(mon => parseMon(mon)).filter(mon => typeof mon === 'object').map(mon => `${mon.name}|${mon.species || ''}|${toId(mon.item)}|${toId(mon.ability)}|${mon.moves.map(move => toId(move)).join(',')}|${mon.nature}|${Object.values(mon.evs).filter(ev => ev === 0).length === 6 ? '' : Object.values(mon.evs).map(ev => ev || '').join(',')}|${mon.gender || ''}|${Object.values(mon.ivs).filter(iv => iv === 31).length === 6 ? '' : Object.values(mon.ivs).map(iv => iv === 31 ? '' : iv).join(',')}|${mon.shiny ? 'S' : ''}|${mon.level === 100 ? '' : mon.level}|${(mon.happiness !== 255 || mon.hiddenpower) ? [(mon.happiness || ''), (mon.hiddenpower || ''), ''].join(',') : ''}`).join(']');
		}
		let link = args.join(' ');
		if (!link.endsWith('/raw')) link += '/raw';
		if (!/^https?:\/\/pokepast\.es\/[a-z0-9]+\/raw$/.test(link)) return message.channel.send('Invalid link - I can only use Pokepast.es. :(');
		require('request')(link, (error, response, body) => {
			if (error) return message.channel.send('Unable to get the data...');
			try {
				message.channel.send("```" + utm(body) + "```");
			} catch (e) {
				message.channel.send(`Something went wrong: ${e.message}`);
			}
		});
	}
}
