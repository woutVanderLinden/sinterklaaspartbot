module.exports = {
	cooldown: 0,
	help: `A list of the GO Fest Pokémon`,
	permissions: 'none',
	commandFunction: function (Bot, room, time, by, args, client, isPM) {
		// eslint-disable-next-line max-len
		const HTML = `<b style="font-size:1.5em;">Wind Hour</b>&nbsp;&nbsp;&nbsp;&nbsp;10:00 to 11:00 and 14:00 to 15:00\n%Mewtwo, Ho-Oh, Latias, Latios, Regigigas, Giratina, Cresselia, Tornadus-Therian, Virizion%\n\n<b style="font-size:1.5em;">Lava Hour</b>&nbsp;&nbsp;&nbsp;&nbsp;11:00 to 12:00 and 15:00 to 16:00\n%Moltres, Entei, Regirock, Groudon, Heatran, Reshiram, Landorus-Therian, Yveltal, Terrakion%\n\n<b style="font-size:1.5em;">Frost Hour</b>&nbsp;&nbsp;&nbsp;&nbsp;12:00 to 13:00 and 16:00 to 17:00\n%Articuno, Suicune, Lugia, Regice, Kyogre, Palkia, Kyurem, Uxie, Mesprit, Azelf%\n\n<b style="font-size:1.5em;">Thunder Hour</b>&nbsp;&nbsp;&nbsp;&nbsp;13:00 to 14:00 and 17:00 to 18:00\n%Zapdos, Raikou, Registeel, Rayquaza, Dialga, Thundurus-Therian, Zekrom, Xerneas, Cobalion%`.replace(/%.*?%/g, match => match.slice(1, -1).split(', ').map(mon => `<span title="${mon}"><psicon pokemon="${mon}"/></span>`).join('&nbsp;')).replace(/\n/g, '<br/>');
		if (!isPM && tools.hasPermission(by, 'gamma', room)) Bot.say(room, `/addhtmlbox ${HTML}`);
		else if (typeof isPM === 'string') Bot.sendHTML(isPM, HTML);
		else Bot.say(room, `/sendprivatehtmlbox ${by}, ${HTML}`);
	}
};
