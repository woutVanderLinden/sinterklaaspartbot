const challenges = {
	gen7monomon: {
		background: "https://i.imgur.com/p0yPtwc.png",
		canBePerfect: true,
		desc: "Use only one Pokemon! The classic Challenge.",
		fullTitle: "[Gen 7] The Monomon Challenge",
		id: "gen7monomon",
		link: "gen7_the_monomon_challenge",
		rules: "Stuff",
		shortTitle: "Monomon"
	},
	monomove: {
		background: null,
		canBePerfect: true,
		desc: "One move go brr",
		fullTitle: "The Monomove Challenge",
		id: "monomove",
		link: "the_monomove_challenge",
		rules: "",
		shortTitle: "Monomove"
	}
};

const playerData = JSON.parse(fs.readFileSync('./data/UC/users.json', 'utf8'));

const challenge = challenges.gen7monomon;

// eslint-disable-next-line max-len
const page = fs.readFileSync('./data/UC/template.html', 'utf8').replace("CHALLENGE_BACKGROUND", challenge.background).replace(/CHALLENGE_TITLE/g, challenge.fullTitle).replace("CHALLENGE_DESCRIPTION", challenge.desc).replace("DROPDOWN_CONTENT", Object.values(challenges).map(chall => `<a href="/1v1uc/challenges/${chall.link}">${chall.shortTitle}</a>`).join('\n\t\t\t\t\t')).replace("TRAINER_DATA", Object.keys(playerData).sort().map(player => playerData[player]).filter(player => player && player.challenges[challenge.id] && player.challenges[challenge.id].length).map(player => `<div class="trainer">\n\t\t\t\t<div class="top">\n\t\t\t\t\t<img class="avatar" src="https://play.pokemonshowdown.com/sprites/trainers/${player.avatar || "unknown"}.png" />\n\t\t\t\t\t<div class="info">\n\t\t\t\t\t\t<strong class="name" style="color: hsl(${tools.HSL(player.name).hsl.map((t, i) => t + (i ? '%' : '')).join(', ')});">${player.name}</strong>\n\t\t\t\t\t\t<div class="score-sum">Rounds Completed - <b>${player.challenges[challenge.id].length}</b></div>${challenge.canBePerfect ? `\n\t\t\t\t\t\t<div class="score-per">Perfect Rounds - <b>${player.challenges[challenge.id].filter(round => round.perfect).length}</b></div>` : ''}\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t\t<hr class="break" />\n\t\t\t\t<div class="rounds">\n\t\t\t\t\t<details class="list">\n\t\t\t\t\t\t<summary class="rname">Rounds</summary>\n\t\t\t\t\t\t${player.challenges[challenge.id].map(round => `<div class="round">\n\t\t\t\t\t\t\t<a class="paste" href="${round.link}">${round.team.map(mon => tools.toSprite(mon) + (mon.endsWith("*") ? "*" : "")).join('&nbsp;')}&nbsp;&nbsp;${round.score ? round.perfect ? `<strong>[${round.score[0]}-${round.score[1]}]</strong>` : `[${round.score[0]}-${round.score[1]}]` : ''}</a>\n\t\t\t\t\t\t</div>`).join('\n\t\t\t\t\t\t')}\n\t\t\t\t\t</details>\n\t\t\t\t</div>\n\t\t\t</div>`).join('\n\t\t\t'));


module.exports = {
	help: `Generates a Challenge page.`,
	guildOnly: '515170462037311498',
	admin: true,
	commandFunction: function (args, message, Bot) {
		fs.writeFile('./public/hofmock.html', page, e => {
			if (e) {
				message.channel.send(e.message);
				Bot.log(e);
				return;
			}
			message.channel.send('Served! http://51.79.52.188:8080/public/hofmock.html');
			// tools.uploadToPastie(JSON.stringify(playerData, null, "\t")).then(url => message.channel.send(url));
		});
	}
};
