module.exports = {
	cooldown: 10000,
	help: `Starts an MnM Tour.`,
	permissions: 'gamma',
	commandFunction: function (Bot, room, time, by, args, client) {
		let type;
		if (args.length) {
			switch (toID(args.join(''))) {
				case 'rr': case 'roundrobin': type = 'Round Robin'; break;
				case 'drr': case '2rr': case 'doubleroundrobin': type = 'Round Robin, , 2'; break;
				default: {
					const id = toID(args.join(''));
					if (!/^e(?:lim(?:ination)?)?[1-9][0-9]*$/.test(id)) {
						return Bot.say(room, `Not a recognized type, sorry. Valid ones are: RR, DRR, Elimination (n)`);
					}
					const n = parseInt(id.replace(/[^0-9]/g, ''));
					if (isNaN(n)) return Bot.log(`Uhh, n isn't a number. ${id}`);
					type = `Elimination, , ${n}`;
					break;
				}
			}
		} else type = 'Elimination';
		// eslint-disable-next-line max-len
		Bot.say(room, `/tour new gen8mixandmega, ${type}\n/tour rules - Uber ++ OU ++ UUBL ++ UU ++ RUBL ++ RU ++ NUBL ++ NU ++ PUBL ++ PU ++ ZU ++ NFE ++ LC Uber ++ LC > 3, One vs One, -Gengar, -Jirachi, -Kyurem, -Mew, -Zeraora, -Banettite, -Focus Sash, -Perish Song, -Moody, +Gengar, +Zeraora, +Blazikenite, +Gengarite, +Shadow Tag\n/tour name Mix and Mega 1v1`);
		try {
			if (!Bot.rooms[room].pinged) {
				// eslint-disable-next-line max-len
				client.channels.cache.get('713967097390301215').send("Hiya, nerds! 1v1 MnM tournament created at https://play.pokemonshowdown.com/groupchat-partbot-1v1mnm - you can PM me with ``Krytocon is cute`` to get an invite if you're not added! <@&738436929586069565>");
				Bot.rooms[room].pinged = true;
			}
		} catch (e) {
			Bot.log(e);
		}
	}
};
