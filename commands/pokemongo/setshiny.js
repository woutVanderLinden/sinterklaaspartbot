module.exports = {
	cooldown: 0,
	help: `Updates PartBot's internal shiny list`,
	permissions: 'beta',
	commandFunction: function (Bot, room, time, by, args, client, isPM) {
		return Bot.roomReply(room, by, `Please check Discord onegai`);
		// eslint-disable-next-line no-unreachable
		const inStr = args.join('');
		if (!inStr) return Bot.roomReply(room, by, 'Mention the Pokémon names and whether they need to be set to true/false!');
		const mons = inStr.split(',').map(toID);
		const tfi = mons.findIndex(mon => ['true', 'false'].includes(mon));
		if (tfi < 0) return Bot.roomReply(room, by, `Mention true/false, please!`);
		const tf = mons[tfi] === 'true';
		mons.splice(tfi, 1);
		if (!mons.length) return Bot.roomReply(room, by, `You also need to mention the Pokémon in question!`);
		const pkmn = mons.map(mon => tools.queryGO(mon));
		if (pkmn.find(t => !t || t.type !== 'pokemon')) return Bot.roomReply('Invalid Pokémon');
		const ids = pkmn.map(mon => toID(mon.info.name));
		ids.forEach(mon => data.godex[mon].shiny = tf);
		fs.writeFile('./data/DATA/godex.json', JSON.stringify(data.godex, null, '\t'), err => {
			if (err) {
				Bot.log(err);
				Bot.roomReply(room, by, `Error: ${err.message}`);
			}
			Bot.roomReply(`Updated! ${tools.listify(pkmn.map(mon => mon.info.name))} are now designated as ${tf ? '' : 'non-'}shiny.`);
			Bot.hotpatch('godex', by);
		});
	}
};
