module.exports = {
	cooldown: 0,
	help: `Host a raid! For a complete guide on hosting and joining raids, use the \`\`${prefix}raidhelp\`\` command.`,
	permissions: 'none',
	commandFunction: function (Bot, room, time, by, args, client) {
		const protoDB = require('origindb')('data/POGO'), DB = protoDB('users');
		const DBU = DB.get(toID(by));
		if (!DBU) return Bot.roomReply(room, by, 'Please register, first!');
		if (DBU.hostBanned || DBU.raidBanned) {
			// eslint-disable-next-line max-len
			return Bot.roomReply(room, by, `You are banned from hosting raids - please contact a roomstaff member for further details.`);
		}
		if (Bot.rooms[room].raids?.[toID(by)]) {
			if (args.length) Bot.say(room, `You're already hosting a raid!`);
			return Bot.rooms[room].raids[toID(by)].HTML();
		}
		args = args.join(' ').split(',');
		let mon = toID(args.shift());
		const weathers = {
			"sunny": ["fire", "grass", "ground"],
			"clear": ["fire", "grass", "ground"],
			"partlycloudy": ["normal", "rock"],
			"cloudy": ["fairy", "fighting", "poison"],
			"rain": ["water", "electric", "bug"],
			"rainy": ["water", "electric", "bug"],
			"snow": ["ice", "steel"],
			"fog": ["dark", "ghost"],
			"windy": ["dragon", "flying", "psychic"],
			"unknown": []
		};
		const icons = {
			bug: 'https://static.wikia.nocookie.net/pokemongo/images/8/88/Icon_Bug.png',
			dark: 'https://static.wikia.nocookie.net/pokemongo/images/e/e9/Icon_Dark.png',
			dragon: 'https://static.wikia.nocookie.net/pokemongo/images/d/d4/Icon_Dragon.png',
			electric: 'https://static.wikia.nocookie.net/pokemongo/images/1/1c/Icon_Electric.png',
			fairy: 'https://static.wikia.nocookie.net/pokemongo/images/7/7f/Icon_Fairy.png',
			fighting: 'https://static.wikia.nocookie.net/pokemongo/images/f/f0/Icon_Fighting.png',
			fire: 'https://static.wikia.nocookie.net/pokemongo/images/0/0a/Icon_Fire.png',
			flying: 'https://static.wikia.nocookie.net/pokemongo/images/b/b0/Icon_Flying.png',
			ghost: 'https://static.wikia.nocookie.net/pokemongo/images/7/7d/Icon_Ghost.png',
			grass: 'https://static.wikia.nocookie.net/pokemongo/images/0/0a/Icon_Grass.png',
			ground: 'https://static.wikia.nocookie.net/pokemongo/images/7/71/Icon_Ground.png',
			ice: 'https://static.wikia.nocookie.net/pokemongo/images/5/52/Icon_Ice.png',
			normal: 'https://static.wikia.nocookie.net/pokemongo/images/4/43/Icon_Normal.png',
			poison: 'https://static.wikia.nocookie.net/pokemongo/images/2/26/Icon_Poison.png',
			psychic: 'https://static.wikia.nocookie.net/pokemongo/images/c/ce/Icon_Psychic.png',
			rock: 'https://static.wikia.nocookie.net/pokemongo/images/5/57/Icon_Rock.png',
			steel: 'https://static.wikia.nocookie.net/pokemongo/images/3/38/Icon_Steel.png',
			water: 'https://static.wikia.nocookie.net/pokemongo/images/6/65/Icon_Water.png'
		};
		let weather = 'unknown', slots;
		let timeLeft, timeHost, note;
		if (args.find(fullArg => {
			let arg = toID(fullArg);
			const num = ~~arg.replace(/slots?/, '');
			if (num) {
				if (slots) {
					// eslint-disable-next-line max-len
					return Bot.roomReply(room, by, `Dunno why you're specifying the number of slots twice. Most of the time, this is because you forgot to mention a unit of time - if you instead meant ${num} minute(s) or something, then say so! It's the same thing as telling someone 'You have 10 to live'. 10 what? Days? Years? Seconds because you're trying to push me off a building?`) || true;
				}
				if (num > 19) return Bot.roomReply(room, by, `OIIIII YOU CAN ONLY HAVE 19 PEOPLE`) || true;
				return (slots = num) && false;
			}
			arg = arg.replace(/weather/, '');
			if (arg === 'constructor') return Bot.roomReply(room, by, `Clear'); DROP TABLE weathers;`) || true;
			if (weathers[arg]) return (weather = arg) && false;
			if (/^hostingin/.test(arg)) {
				fullArg = fullArg.replace(/^h ?o ?s ?t ?i ?n ?g ?i ?n ?/i, '');
				const timeHostRun = tools.fromHumanTime(arg);
				if (!timeHostRun) return Bot.roomReply(room, by, `Invalid value of hosting time: ${arg}`) || true;
				if (timeHost) {
					// eslint-disable-next-line max-len
					return Bot.roomReply(room, by, `Uhh why are you hosting at two times again\nIs this what they call two-timing?`) || true;
				}
				timeHost = timeHostRun;
				return false;
			}
			if (arg.startsWith('note')) {
				note = fullArg.replace(/note\W*/i, '');
				if (note === fullArg) {
					return Bot.roomReply(room, by, `C-could you please not add random characters in the note?`) || true;
				}
				return false;
			}
			const timeTry = tools.fromHumanTime(arg);
			if (timeTry) {
				if (timeLeft) {
					// eslint-disable-next-line max-len
					return Bot.roomReply(room, by, `...it's expiring twice? Are you sure you didn't mean to host at one of those instead? If so, add a 'hosting in' before that time!`) || true;
				}
				return (timeLeft = timeTry) && false;
			}
			return Bot.roomReply(room, by, `Dunno what you meant by ${arg}. Sorry, me smol brain 'o.o`) || true;
		})) return;
		if (!slots) slots = 5;
		if (timeHost > timeLeft) return Bot.roomReply(room, by, `Isn't that, like, after the raid ends?`);
		if (timeLeft > 4 * 60 * 60 * 1000) {
			return Bot.roomReply(room, by, `Ah, yes. I, too, enjoy hosting raids that last for ${tools.toHumanTime(timeLeft)}`);
		}
		const user = toID(by);
		if (!Bot.rooms[room].raids) Bot.rooms[room].raids = {};
		const query = tools.queryGO(mon);
		if (query?.type === 'pokemon') mon = query.info;
		else return Bot.roomReply(room, by, 'Invalid Pokémon');
		Bot.rooms[room].raids[user] = {};
		const raid = Bot.rooms[room].raids[user];
		raid.pokemon = mon.name;
		raid.mon = toID(mon.name);
		raid.weather = weather;
		raid.wb = mon.types.some(t => weathers[raid.weather].includes(toID(t)));
		raid.host = user;
		raid.pings = (raid.wb ? Bot.rooms[room].users.filter(u => {
			return DB.get(toID(u))?.raids.hasOwnProperty(raid.mon);
		}) : Bot.rooms[room].users.filter(u => {
			return DB.get(toID(u))?.raids[raid.mon] === false;
		})).map(u => u.substr(1).replace(/@!$/, ''));
		raid.players = {};
		raid.slots = slots;
		raid.hostName = by.substr(1);
		raid.note = note;
		raid.HTML = function (pings) {
			const players = [raid.host, ...Object.keys(raid.players)].map(u => require('origindb')('data/POGO')('users').get(u));
			// eslint-disable-next-line max-len
			let joinHTML = players.length > 1 ? `<br/><table style="border:1px;border-collapse:collapse;"><tr><th style="width:110px;text-align:left">PS Name</th><th style="width:100px;text-align:left">IGN</th><th style="width:30px;text-align:left">Lv</th><th style="width:120px;text-align:left">Friend Code</th></tr>${players.map(u => `<tr><td>${tools.colourize(u.displayName)}</td><td>${tools.escapeHTML(u.ign)}</td><td>${u.level}</td><td>${u.code.slice(0, 4)}<span style="padding:5px;">${u.code.slice(4, 8)}</span>${u.code.slice(8, 12)}</td></tr>`).join('')}</table><br/>` : '-<br/><br/>';
			if (players.length <= slots && !raid.locked) {
				joinHTML += `<button name="send" value="/botmsg ${Bot.status.nickName},${prefix}joinraid ${user}">Join</button>`;
			}
			joinHTML += `<button name="send" value="/botmsg ${Bot.status.nickName},${prefix}leaveraid ${user}">Leave</button>`;
			// eslint-disable-next-line max-len
			const hiddenCodes = joinHTML.replace('<th style="width:120px;">Friend Code</th>', '').replace(/<td>\d{4}<span style="padding:5px;">\d{4}<\/span>\d{4}<\/td>(?=<\/tr)/g, '');
			if (pings) raid.pings.forEach(u => Bot.say(room, `/notifyuser ${u}, Raid notification!, ${raid.pokemon}`));
			// eslint-disable-next-line max-len
			Bot.say(room, `/adduhtml RAIDHTML${by}, <div class="infobox" style="text-align:center;"><center><h2><psicon pokemon="${raid.mon}">${tools.colourize(raid.hostName)} is hosting a ${raid.wb ? 'Weather-Boosted ' : ''}<b>${raid.pokemon}</b> raid! <psicon pokemon="${raid.mon}"></h2>${weathers[raid.weather].length || raid.hostStamp ? `<small>${weathers[raid.weather] ? `Current boosted types: ${weathers[raid.weather].map(type => `<img src="${icons[type]}" height="20" width="20" style="vertical-align:middle;"/>`).join(' ')}${raid.hostStamp ? '<br/>' : ''}` : ''}${raid.hostStamp || ''}</small><br/><br/>` : ''}${raid.note ? `Note: ${tools.escapeHTML(raid.note)}<br/>` : ''}${hiddenCodes}${pings ? `<br/><br/><small>Pinged ${pings}</small>` : ''}</center></div>`);
			// eslint-disable-next-line max-len
			Bot.say(room, `/changeprivateuhtml ${by}, RAIDHTML${by}, <div class="infobox" style="text-align:center;"><center><h2><psicon pokemon="${raid.mon}">${tools.colourize(raid.hostName)} is hosting a ${raid.wb ? 'Weather-Boosted ' : ''}<b>${raid.pokemon}</b> raid! <psicon pokemon="${raid.mon}"></h2>${weathers[raid.weather].length || raid.hostStamp ? `<small>${weathers[raid.weather] ? `Current boosted types: ${weathers[raid.weather].map(type => `<img src="${icons[type]}" height="20" width="20" style="vertical-align:middle;"/>`).join(' ')}${raid.hostStamp ? '<br/>' : ''}` : ''}${raid.hostStamp || ''}</small><br/><br/>` : ''}${raid.note ? `Note: ${tools.escapeHTML(raid.note)}<br/>` : ''}${joinHTML}${pings ? `<br/><br/><small>Pinged ${pings}</small>` : ''}${players.length > 1 ? `<br/><br/><b style="border:1px;">${players.slice(1).map(u => tools.escapeHTML(u.ign)).join(',')}</b>` : ''}</center></div>`);
		};
		raid.endTime = Date.now() + (timeLeft || 100 * 60 * 1000);
		if (timeHost) {
			raid.hostTime = Date.now() + timeHost;
			const xStamp = new Date(raid.hostTime).toLocaleTimeString('GMT', { timeZone: 'GMT' }).split(':')[1];
			raid.hostStamp = `Hosting at <b>XX:${xStamp}</b>`;
			raid.hostTimer = setTimeout(() => {
				Bot.say(room, `${Bot.rooms[room].raids[user].hostName}, you ready to host?`);
			}, timeHost);
		}
		raid.timer = setTimeout(() => {
			Bot.say(room, `${Bot.rooms[room].raids[user].hostName}'s raid expired!`);
			delete Bot.rooms[room].raids[user];
		}, timeLeft || 100 * 60 * 1000);
		if (timeLeft) {
			if (timeLeft > 10 * 60 * 1000) {
				raid.warningTimer = setTimeout(() => {
					// eslint-disable-next-line max-len
					Bot.say(room, `@${raid.hostName} there's, like, 10 minutes left; probably host soon - if you're done, use \`\`${prefix}endraid\`\`!`);
				}, timeLeft - 10 * 60 * 1000);
			}
			if (timeLeft > 5 * 60 * 1000) {
				raid.fiveTimer = setTimeout(() => {
					// eslint-disable-next-line max-len
					Bot.say(room, `@${raid.hostName} there's, like, 5 minutes left; people are likely to lose their passes if you raid any later. If you're done, use \`\`${prefix}endraid\`\`!`);
				}, timeLeft - 5 * 60 * 1000);
			}
		}
		raid.code = DBU.code;
		const pings = tools.escapeHTML(tools.listify(raid.pings));
		raid.HTML(pings);
	}
};
