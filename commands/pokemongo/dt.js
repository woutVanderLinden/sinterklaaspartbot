module.exports = {
	help: `Shows the info of a Pokemon.`,
	permissions: 'none',
	commandFunction: function (Bot, room, time, by, args, client, isPM) {
		if (!args.length) return Bot.roomReply(room, by, unxa);
		const monID = toID(args.join(''));
		const final = tools.queryGO(monID);
		if (!final) return Bot.roomReply(room, by, `No matches found.`);
		switch (final.type) {
			case 'pokemon': {
				const mon = final.info;
				const L40_CP = tools.getCP(mon.name, 40), L50_CP = tools.getCP(mon.name, 50), L51_CP = tools.getCP(mon.name, 51);
				const stats = mon.baseStats;
				// eslint-disable-next-line max-len
				const html = `<div class="message"><ul class="utilichart"><li class="result"><span class="col numcol">${mon.unreleased ? 'UR' : 'GO'}</span> <span class="col iconcol"><psicon pokemon="${toID(mon.name)}"/></span> <span class="col pokemonnamecol" style="white-space:nowrap"><a href="https://dex.pokemonshowdown.com/pokemon/${toID(mon.name)}" target="_blank">${mon.name}</a></span> <span class="col typecol">${mon.types.map(type => `<img src="https://play.pokemonshowdown.com/sprites/types/${type}.png" alt="${type}" height="14" width="32">`).join('')}</span> <span style="float:left;min-height:26px"><span class="col statcol"><em>Atk</em><br />${stats.atk}</span> <span class="col statcol"><em>Def</em><br />${stats.def}</span> <span class="col statcol"><em>Sta</em><br />${stats.sta}</span> <span class="col bstcol" style="margin-left:10px;"><em>40</em><br />${L40_CP}</span> <span class="col bstcol" style="margin-left:10px;"><em>50</em><br />${L50_CP}</span> <span class="col bstcol" style="margin-left:10px;"><em>MCP</em><br />${L51_CP}</span> </span></li><li style="clear:both"></li></ul></div><font size="1"><font color="#686868">Dex#:</font> ${mon.num}&nbsp;|&ThickSpace;<font color="#686868">Gen:</font> ${[0, 152, 252, 387, 495, 650, 722, 810, 906, 1011].findIndex(num => mon.num < num)}&nbsp;|&ThickSpace;<font color="#686868">Height:</font> ${mon.heightm} m&nbsp;|&ThickSpace;<font color="#686868">Weight:</font> ${mon.weightkg} kg${mon.shiny ? '&nbsp;|&ThickSpace; ✓ Can be shiny' : ''}${mon.shinyLocked ? '&nbsp;|&ThickSpace;Shiny-locked' : ''}&nbsp;|&ThickSpace;<font color="#686868">Evolution:</font> ${mon.evos?.join(', ') || 'None'}</font>`;
				if (isPM) Bot.sendHTML(by, html);
				else if (tools.hasPermission(by, 'gamma', room)) Bot.say(room, `/addhtmlbox ${html}`);
				else Bot.say(room, `/sendprivatehtmlbox ${by}, ${html}`);
				break;
			}
			case 'charged_move': {
				const move = final.info;
				// eslint-disable-next-line max-len
				const html = `<ul class="utilichart"><li class="result"><span class="col movenamecol">&nbsp;<a href="https://gamepress.gg/pokemongo/pokemon-move/${move.name.replace(/ /g, '-').toLowerCase()}">${move.name}</a></span> <span class="col typecol"><img src="//play.pokemonshowdown.com/sprites/types/${move.type}.png" alt="${move.type}" width="32" height="14"><img src="//play.pokemonshowdown.com/sprites/categories/Physical.png" alt="Charged" width="32" height="14"></span> <span class="col widelabelcol"><em>Energy</em><br>${move.energy}</span> <span class="col widelabelcol"><em>Power</em><br>${move.power}</span> <span class="col labelcol"><em>DPE</em><br>${move.dpe}</span> <span class="col movedesccol">&nbsp;&nbsp;${move.desc}</span> </li></ul>`;
				if (isPM) Bot.sendHTML(by, html);
				else if (tools.hasPermission(by, 'gamma', room)) Bot.say(room, `/addhtmlbox ${html}`);
				else Bot.say(room, `/sendprivatehtmlbox ${by}, ${html}`);
				break;
			}
			case 'fast_move': {
				const move = final.info;
				// eslint-disable-next-line max-len
				const html = `<ul class="utilichart"><li class="result"><span class="col movenamecol">&nbsp;<a href="https://gamepress.gg/pokemongo/pokemon-move/${move.name.replace(/ /g, '-').toLowerCase()}">${move.name}</a></span> <span class="col typecol"><img src="//play.pokemonshowdown.com/sprites/types/${move.type}.png" alt="${move.type}" width="32" height="14"><img src="//play.pokemonshowdown.com/sprites/categories/Special.png" alt="Fast" width="32" height="14"></span> <span class="col widelabelcol"><em>Energy</em><br>${move.energy}</span> &nbsp;<span class="col labelcol"><em>Power</em><br>${move.power}</span><span class="col pplabelcol" style="padding:0;width:5px"></span><span class="col labelcol"><em>Turns</em><br>${move.turns}</span> &nbsp;<span class="col labelcol"><em>EPS</em><br>${move.eps}</span> <span class="col labelcol"><em>DPS</em><br>${move.dps}</span> </li></ul>`;
				if (isPM) Bot.sendHTML(by, html);
				else if (tools.hasPermission(by, 'gamma', room)) Bot.say(room, `/addhtmlbox ${html}`);
				else Bot.say(room, `/sendprivatehtmlbox ${by}, ${html}`);
				break;
			}
		}
	}
};
