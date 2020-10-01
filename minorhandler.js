exports.handler = (Bot, app) => {
	Bot.teams = {
		OU: ["Terrakion||focussash|justified|closecombat,stoneedge,stealthrock,swordsdance|Jolly|,252,4,,,252|||||]Bisharp||blackglasses|defiant|suckerpunch,knockoff,ironhead,swordsdance|Adamant|,252,4,,,252|||||]Sigilyph||lifeorb|magicguard|calmmind,psychic,heatwave,dazzlinggleam|Timid|4,,,252,,252||,0,,,,|||]Ninetales-Alola||lightclay|snowwarning|moonblast,freezedry,auroraveil,hail|Timid|248,,,8,,252||,0,,,,|||]Zeraora||lifeorb|voltabsorb|plasmafists,closecombat,knockoff,grassknot|Naive|,252,,4,,252|||||]Necrozma||weaknesspolicy|prismarmor|calmmind,photongeyser,heatwave,rockpolish|Modest|,,4,252,,252||,0,,,,|||", "Scizor||lifeorb|technician|swordsdance,bulletpunch,psychocut,knockoff|Adamant|40,252,,,,216|||||]Rillaboom||choiceband|grassysurge|woodhammer,grassyglide,superpower,uturn|Adamant|,252,,,4,252|||||]Crawdaunt||lifeorb|adaptability|swordsdance,knockoff,crabhammer,aquajet|Adamant|4,252,,,,252|||||]Togekiss||choicescarf|serenegrace|trick,airslash,dazzlinggleam,flamethrower|Timid|,,,252,4,252||,0,,,,|||]Zeraora||lifeorb|voltabsorb|plasmafists,knockoff,closecombat,grassknot|Naughty|,252,,4,,252|||||]Necrozma||powerherb|prismarmor|meteorbeam,stealthrock,photongeyser,heatwave|Modest|72,,,240,12,184||,0,,,,|||", "Dragapult||lifeorb|infiltrator|dragondance,dragondarts,steelwing,fireblast|Adamant|,252,,,4,252|||||]Indeedee||choicescarf|psychicsurge|expandingforce,dazzlinggleam,mysticalfire,trick|Timid|,,,252,4,252||,0,,,,|||]Hawlucha||psychicseed|unburden|swordsdance,acrobatics,closecombat,taunt|Adamant|,252,4,,,252|||||]Toxtricity||lifeorb|punkrock|shiftgear,drainpunch,boomburst,overdrive|Modest|,32,,252,,144|||||]Excadrill||focussash|moldbreaker|stealthrock,earthquake,rapidspin,steelbeam|Naive|,252,,4,,252|||||]Kommo-o||throatspray|bulletproof|clangingscales,flashcannon,closecombat,clangoroussoul|Naive|,4,,252,,252|||||"]
	}

	Bot.on('chaterror', (room, message, isIntro) => {
		if (!isIntro) console.log('ERROR: ' + room + '> ' + message);
	});
	Bot.on('popup', (message) => console.log('POPUP: ' + message));
	Bot.on('tour', (room, data) => {
		if (data && data[0] === 'create') {
			if (['*', '#', '★'].includes(Bot.rooms[room].rank) && config.tourTimerRooms.includes(room)) Bot.say(room, '/tour autostart 2\n/tour autodq 1.5')
		}
	});
	Bot.on('join', (by, room, time) => {
		if (!Bot.jps[room] || !Bot.jps[room][by]) return;
		if (Bot.jpcool[room][by] && (Bot.jpcool[room][by][0] < 10 || time - Bot.jpcool[room][by][1] < 3600000)) return;
		Bot.say(room, Bot.jps[room][by]);
		if (!Bot.jpcool[room]) Bot.jpcool[room] = {};
		Bot.jpcool[room][by] = [0, time];
		return;
	});
	Bot.on('raw', (room, data, isIntro) => {
		if (!isIntro && /<div class="broadcast-blue">Congratulations to .* for winning the game of UNO!<\/div>/.test(data)) {
			let userline = data.match(/<div class="broadcast-blue">Congratulations to .* for winning the game of UNO!<\/div>/)[0], user = userline.slice(47, userline.length - 35);
			Bot.say(room, `Congratulations to ${user} for winning!`);
			if (Bot.rooms[room].shop && Bot.rooms[room].shop.nerdbadges && Bot.rooms[room].shop.nerdbadges.includes(toId(user)) && Math.random() > 0.5) Bot.say(room, `${user} won! #HYDROISNERD`);
			tools.addPoints(0, user, 10, room);
		}
	});
	Bot.on('joinRoom', room => {});
	Bot.on('chatsuccess', (room, time, by, message) => {
		Bot.rooms[room].rank = by.charAt(0);
	});
	Bot.on('pmsuccess', (to, message) => {});
	Bot.on('updatechallenges', data => {
		try {
			data = JSON.parse(data).challengesFrom;
			for (let key in data) {
				if (data[key] === 'gen8ou') {
					if (!Bot.teams.OU.length) {
						Bot.pm(key, "Sorry, I don't have a team for OU.");
						continue;
					}
					Bot.say('', '/utm ' + Bot.teams.OU.random());
					Bot.say('', '/accept ' + key);
					Bot.log(`Fighting ${key}.`);
					return;
				}
				else Bot.pm(key, "Sorry, I only play [Gen 8] OU.");
			}
		} catch (e) {
			Bot.log(e);
			Bot.log(data);
		}
	});
}
