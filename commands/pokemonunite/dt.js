// TODO: HOLY SHIT REFACTOR THIS
/* eslint-disable max-len */

module.exports = {
	cooldown: 0,
	help: `Information about all characters in Unite! Syntax \`\`${prefix}dt mon[, level (optional)]\`\``,
	permissions: 'none',
	commandFunction: function (Bot, room, time, by, args, client, redir) {
		let [pkmn, lv] = args.join('').split(',');
		pkmn = toID(pkmn);
		if (lv) lv = lv.replace(/\D/ig, '');
		lv = ~~lv;
		if (lv < 1) lv = 15;
		if (lv > 15) return Bot.roomReply(room, by, `Invalid level (${lv})`);
		let html = 'Not found', key;
		const mon = data.unitedex.find(m => toID(m.name) === pkmn);
		if (mon) {
			key = pkmn;
			const stats = data.unitestats.find(m => m.name === mon.name).level[lv - 1];
			const hst = { ...data.unitestats[0].level[lv - 1] };
			data.unitestats.forEach(stat => {
				Object.entries(stat.level[lv - 1]).forEach(([k, v]) => {
					if (hst[k] < v) hst[k] = v;
				});
			});
			html = nunjucks.render('unite/character.njk', { mon, lv, hst, stats, redir }).replace(/[\n\t]/g, '');
		}
		const battle = data.uniteitems.battle.find(m => toID(m.name) === pkmn);
		if (battle) {
			key = battle.name;
			html = `<div><div style="float:left"><img src="https://d275t8dp8rxb42.cloudfront.net/items/battle/${battle.name.replace(/ /g, '+')}.png" style="margin:10px 0" height="100" width="100"/></div><div style="overflow:hidden;vertical-align:top;padding:15px"><span style="font-size:1.3em;font-weight:bold">${battle.name}</span><span style="padding:10px;font-size:0.7em;border-radius:5px;margin:0 5px;background-color:rgba(128,128,128,0.2);fill:#ffd283"><img src="https://i.postimg.cc/yk8dFtSP/newcooldown.png" height="20" width="20" style="vertical-align:middle;"/>&nbsp;${battle.cooldown}s</span><p>${battle.description}</p></div></div>`;
		}
		const held = data.uniteitems.held.find(m => toID(m.name) === pkmn);
		if (held) {
			key = held.name;
			const bonuses = [1, 2, 3].map(n => held[`bonus${n}`]).filter(x => x);
			html = `<img src="https://d275t8dp8rxb42.cloudfront.net/items/held/${held.name.replace(/ /g, '+')}.png" style="float:left" height="100" width="100"/><div style="overflow:hidden;vertical-align:top;padding:15px"><div style="font-size:1.3em;font-weight:bold">${held.name}</div>${bonuses.length ? `<div>Bonus${bonuses.length === 1 ? '' : 'es'}: <b style="color:#22bb77">${bonuses.join(', ')}</b></div>` : ''}<p>${held.description1}</p></div>`;
		}
		if (redir) return html;
		if (tools.hasPermission(by, 'gamma', room)) Bot.say(room, `/adduhtml unite${key}, ${html || 'Not found!'}`);
		else Bot.say(room, `/sendprivateuhtml ${by}, unite${key}, ${html || 'Not found.'}`);
		return;
	}
};
