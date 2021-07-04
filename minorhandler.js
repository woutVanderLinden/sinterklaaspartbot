exports.handler = {
	initialize: () => {
		Bot.DB = require('origindb')('data/DATA');
		Bot.userAppeared = function (user) {
			user = toID(user);
			let mails = require('origindb')('data/DATA')('mails').get(user);
			if (!Bot.lmp) Bot.lmp = {};
			if (!mails || !mails.length) return;
			if (Bot.lmp[user] === mails.length) return;
			Bot.lmp[user] = mails.length;
			Bot.pm(user, `You have ${mails.length} unread mail${mails.length === 1 ? '' : 's'} (from ${tools.listify([...new Set(mails.map(mail => mail.author))])})! Use \`\`${prefix}readmail\`\` to view ${mails.length === 1 ? 'it' : 'them'}!`);
		}
		Bot.teams = {
			gen8ou: ["Terrakion||focussash|justified|closecombat,stoneedge,stealthrock,swordsdance|Jolly|,252,4,,,252|||||]Bisharp||blackglasses|defiant|suckerpunch,knockoff,ironhead,swordsdance|Adamant|,252,4,,,252|||||]Sigilyph||lifeorb|magicguard|calmmind,psychic,heatwave,dazzlinggleam|Timid|4,,,252,,252||,0,,,,|||]Ninetales-Alola||lightclay|snowwarning|moonblast,freezedry,auroraveil,hail|Timid|248,,,8,,252||,0,,,,|||]Zeraora||lifeorb|voltabsorb|plasmafists,closecombat,knockoff,grassknot|Naive|,252,,4,,252|||||]Necrozma||weaknesspolicy|prismarmor|calmmind,photongeyser,heatwave,rockpolish|Modest|,,4,252,,252||,0,,,,|||", "Scizor||lifeorb|technician|swordsdance,bulletpunch,psychocut,knockoff|Adamant|40,252,,,,216|||||]Rillaboom||choiceband|grassysurge|woodhammer,grassyglide,superpower,uturn|Adamant|,252,,,4,252|||||]Crawdaunt||lifeorb|adaptability|swordsdance,knockoff,crabhammer,aquajet|Adamant|4,252,,,,252|||||]Togekiss||choicescarf|serenegrace|trick,airslash,dazzlinggleam,flamethrower|Timid|,,,252,4,252||,0,,,,|||]Zeraora||lifeorb|voltabsorb|plasmafists,knockoff,closecombat,grassknot|Naughty|,252,,4,,252|||||]Necrozma||powerherb|prismarmor|meteorbeam,stealthrock,photongeyser,heatwave|Modest|72,,,240,12,184||,0,,,,|||", "Dragapult||lifeorb|infiltrator|dragondance,dragondarts,steelwing,fireblast|Adamant|,252,,,4,252|||||]Indeedee||choicescarf|psychicsurge|expandingforce,dazzlinggleam,mysticalfire,trick|Timid|,,,252,4,252||,0,,,,|||]Hawlucha||psychicseed|unburden|swordsdance,acrobatics,closecombat,taunt|Adamant|,252,4,,,252|||||]Toxtricity||lifeorb|punkrock|shiftgear,drainpunch,boomburst,overdrive|Modest|,32,,252,,144|||||]Excadrill||focussash|moldbreaker|stealthrock,earthquake,rapidspin,steelbeam|Naive|,252,,4,,252|||||]Kommo-o||throatspray|bulletproof|clangingscales,flashcannon,closecombat,clangoroussoul|Naive|,4,,252,,252|||||"],
			gen8metronomebattle: [`Dusclops||eviolite|unaware|metronome|Relaxed|252,252,252,252,252,||,,,,,0|||]Dusclops||eviolite|unaware|metronome|Relaxed|252,252,252,252,252,||,,,,,0|||`]
		}
		Bot.hotpatch = require('./data/hotpatch.js');
		Bot.watcher = require('./watcher.js')();
		if (!Bot.seenBattles) Bot.seenBattles = new Set();
		Bot.commandHandler = require('./commands.js');
		GAMES.init();
	},
	chaterror: (room, message, isIntro) => {
		if (message.match(/^The user .*? is offline\.$/) || message.match(/^You do not have permission to use PM HTML to users who are not in this room\.$/)) return;
		if (!isIntro) console.log('ERROR: ' + room + '> ' + message);
		try {
			client.channels.cache.get('719087165241425981').send('ERROR: ' + room + '> ' + message);
		} catch {};
	},
	popup: (message) => console.log('POPUP: ' + message),
	tour: (room, data) => {
		require('./tours.js')(room, data, Bot);
	},
	join: (by, room, time) => {
		Bot.userAppeared(by);
		if (!Bot.jps[room] || !Bot.jps[room][by]) return;
		if (Bot.jpcool[room][by] && (Bot.jpcool[room][by][0] < 10 || time - Bot.jpcool[room][by][1] < 3600000)) return;
		Bot.say(room, Bot.jps[room][by]);
		if (!Bot.jpcool[room]) Bot.jpcool[room] = {};
		Bot.jpcool[room][by] = [0, time];
		return;
	},
	nick: (by, old, room, time) => {
		if (by === old) return;
		Bot.DB('joins').set(old, time);
		Bot.userAppeared(by);
		let nDB = Bot.DB('alts').object();
		if (!nDB[by]) nDB[by] = [];
		if (!nDB[by].includes(old)) {
			nDB[by].push(old);
			if (!nDB[old]) nDB[old] = [];
			nDB[old].push(by);
		}
		Bot.DB.save();
	},
	leave: (by, room, time) => {
		Bot.DB('joins').set(by, time);
		return;
	},
	raw: (room, data, isIntro) => {
		if (isIntro) return;
	},
	joinRoom: room => {
		try {
			let roomData = require(`./data/ROOMS/${room}.json`);
			if (roomData.assign) Object.keys(roomData.assign).forEach(key => {
				if (Bot.rooms[room]) Bot.rooms[room][key] = roomData.assign[key];
			});
			['auth', 'ignore', 'blacklist', 'whitelist', 'template'].forEach(key => {
				if (roomData.hasOwnProperty(key)) Bot.rooms[room][key] = roomData[key];
			});
		} catch {};
		return;
	},
	chatsuccess: (room, time, by, message) => {
		if (!message.charAt(0) === '/') Bot.rooms[room].rank = by.charAt(0);
	},
	pmsuccess: (to, message) => {},
	updatechallenges: data => {
		try {
			data = JSON.parse(data).challengesFrom;
			for (let key in data) {
				if (data[key] === 'gen8ou') {
					if (!Bot.teams.gen8ou.length) {
						Bot.pm(key, "Sorry, I don't have a team for OU.");
						continue;
					}
					Bot.say('', '/utm ' + Bot.teams.gen8ou.random());
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
	},
	queryresponse: info => {
		info = info.split('|');
		let type = info.shift();
		if (type === 'roomlist') {
			if (!Bot.rooms['2v2']) return;
			try {
				let rooms = JSON.parse(info.join('|')).rooms;
				let batts = Object.keys(rooms);
				batts.forEach(batt => {
					if (Bot.seenBattles.has(batt)) return;
					let battle = rooms[batt];
					if (!battle.minElo || battle.minElo === 'tour') return; // don't report direct challenges / tour battles
					let prefix = Bot.rooms['2v2']._ladderPrefix, floor = Bot.rooms['2v2']._ladderFloor;
					if (floor && battle.minElo < floor) return; // Rating floor
					if (prefix && !toID(battle.p1).startsWith(prefix) && !toID(battle.p2).startsWith(prefix)) return; // Ladder prefix
					Bot.seenBattles.add(batt);
					Bot.say('2v2', `/addhtmlbox <span class="username">${tools.colourize(battle.p1)}</span> vs <span class="username">${tools.colourize(battle.p2)}</span>: «<a href="/${batt}" style="margin-top:25px;">${batt}</a>» (${battle.minElo})`);
				});
			} catch (e) {
				Bot.log(e);
			}
		}
		else if (type === 'roominfo') {
			try {
				let room = JSON.parse(info.join('|'));
				if (!Bot.rooms[room.id]) return;
				if (room.id.startsWith('view-bot-')) return; // don't parse stuff from HTML rooms
				Bot.rooms[room.id].type = room.visibility;
				Bot.rooms[room.id].rank = room.users.find(u => toID(u) === toID(Bot.status.nickName))?.[0];
			} catch (e) {
				Bot.log(e);
				Bot.log(info);
			}
		}
	},
	line: (room, message, isIntro) => {
		if (message.charAt(0) === '>' || isIntro) return;
		if (!Bot.streams[room]) return;
		const stream = Bot.streams[room];
		stream.write(`\n${message}`);
	},
	battle: (...args) => {
		require('./battle.js').handler(...args);
	}
}