module.exports = {
	cooldown: 1,
	help: `Generates the HPL page.`,
	permissions: 'coder',
	commandFunction: function (Bot, room, time, by, args, client) {
		delete require.cache[require.resolve('../../data/DATA/hpl-week7.json')];
		const data = require('../../data/DATA/hpl-week7.json');
		const html = fs.readFileSync('./pages/hplt.html', 'utf8');
		const info = Object.keys(data).map(batch => {
			const names = batch.split(' vs ');
			const stuff = data[batch];
			const scores = [0, 0];
			Object.values(stuff.tiers).forEach(tier => {
				if (tier[2][0] > tier[2][1]) scores[0]++;
				else if (tier[2][1] > tier[2][0]) scores[1]++;
			});
			// eslint-disable-next-line max-len
			return `<table><tr><th colspan="6" style="background: ${stuff.colours[0]}; color: ${stuff.colours[1]};"><img src="${stuff.sprites[0]}" height="30px" width="30px" style="vertical-align: middle;" /> ${names[0]} (${scores[0]})</th><th class="vs">vs</th><th colspan="6" style="background: ${stuff.colours[2]}; color: ${stuff.colours[3]};"><img src="${stuff.sprites[1]}" height="30px" width="30px" style="vertical-align: middle;" /> ${names[1]} (${scores[1]})</th></tr><tr><td class="hidden"> </td><td class="hidden"> </td><td class="hidden"> </td><td class="hidden"> </td><td class="hidden"> </td><td class="hidden"> </td><td class="vs"> </td><td class="hidden"> </td><td class="hidden"> </td><td class="hidden"> </td><td class="hidden"> </td><td class="hidden"> </td><td class="hidden"> </td></tr>${Object.keys(stuff.tiers).map(tier => {
				const name = tier;
				tier = stuff.tiers[tier];
				// eslint-disable-next-line max-len
				return `<tr><td class="tier" colspan="2">${name}</td><td class="player" colspan="4">${tools.colourize(tier[0])}</td><td class="vs">${tier[2].reduce((a, b) => a + b, 0) ? tier[2][0] : ''}-${tier[2].reduce((a, b) => a + b, 0) ? tier[2][1] : ''}</td><td class="player" colspan="4">${tools.colourize(tier[1])}</td><td class="matches" colspan="2">${tier[3].map((replay, index) => replay ? replay === "act" ? "<strong>ACTIVITY</strong>" : `<a href="${replay}" target="_blank"><button>${index + 1}</button></a>` : `<button onclick="window.alert('Not uploaded.')">${index + 1}</button>`).join('')}</td></tr>`;
			}).join('')}</table>`;
		}).join('<br/><br/>');
		fs.writeFile('./pages/hpl/week7.html', html.replace(/INFO/, info), e => e ? Bot.log(e) : Bot.say(room, ":thumbs:"));
	}
};
