module.exports = {
	cooldown: 0,
	help: `Sets your PoGo raid list.`,
	permissions: 'none',
	commandFunction: function (Bot, room, time, by, args, client, isPM) {
		const cargs = args.join(' ').split(',');
		let [mon, ...lv] = cargs;
		mon = toID(mon);
		if (!lv.length) lv = ['20', '25'];
		lv = lv.map(t => parseFloat(t.replace(/[^0-9\.]/g, ''))).slice(0, 2);
		if (lv.find(n => n > 51 || n < 1 || 2 * n % 1)) {
			return Bot.roomReply(room, by, `Uhh why do you want to look at such a high level`);
		}
		mon = tools.queryGO(mon);
		if (mon?.type !== 'pokemon') {
			return Bot.roomReply(room, by, `Didn't find that as a valid Pokémon; I'm probably just bad.`);
		}
		mon = mon.info;
		const divs = [[10, 10, 10], [15, 15, 15]];
		// eslint-disable-next-line max-len
		const output = `${mon.name} can have a CP of ${divs.map(ivs => tools.getCP(mon.name, lv[0], ivs)).join('-')} at Lv${lv[0]}${lv[1] ? ` (${divs.map(ivs => tools.getCP(mon.name, lv[1], ivs)).join('-')} at Lv${lv[1]})` : ''}, and can${mon.shiny ? '' : "not"} be shiny.`;
		if (isPM) return Bot.pm(by, output);
		else if (tools.hasPermission(by, 'gamma', room)) return Bot.say(room, output);
		else Bot.roomReply(room, by, output);
	}
};
