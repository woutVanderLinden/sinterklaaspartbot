module.exports = {
	cooldown: 0,
	help: `Host a raid! For a complete guide on hosting and joining raids, use the \`\`${prefix}raidhelp\`\` command.`,
	permissions: 'none',
	commandFunction: function (Bot, room, time, by, args, client) {
		const protoDB = require('origindb')('data/POGO'), DB = protoDB('users');
		const DBU = DB.get(toID(by));
		if (!DBU) return Bot.roomReply(room, by, 'Please register, first!');
		args = args.join('').split(',').map(toID);
		let mon = args.shift();
		const weathers = {
			"sunny": ["fire", "grass", "ground"],
			"clear": ["fire", "grass", "ground"],
			"partlycloudy": ["normal", "rock"],
			"cloudy": ["fairy", "fighting", "poison"],
			"rain": ["water", "electric", "bug"],
			"snow": ["ice", "steel"],
			"fog": ["dark", "ghost"],
			"windy": ["dragon", "flying", "psychic"],
			"unknown": []
		}
		const icons = {
			bug:      'https://static.wikia.nocookie.net/pokemongo/images/8/88/Icon_Bug.png',
			dark:     'https://static.wikia.nocookie.net/pokemongo/images/e/e9/Icon_Dark.png',
			dragon:   'https://static.wikia.nocookie.net/pokemongo/images/d/d4/Icon_Dragon.png',
			electric: 'https://static.wikia.nocookie.net/pokemongo/images/1/1c/Icon_Electric.png',
			fairy:    'https://static.wikia.nocookie.net/pokemongo/images/7/7f/Icon_Fairy.png',
			fighting: 'https://static.wikia.nocookie.net/pokemongo/images/f/f0/Icon_Fighting.png',
			fire:     'https://static.wikia.nocookie.net/pokemongo/images/0/0a/Icon_Fire.png',
			flying:   'https://static.wikia.nocookie.net/pokemongo/images/b/b0/Icon_Flying.png',
			ghost:    'https://static.wikia.nocookie.net/pokemongo/images/7/7d/Icon_Ghost.png',
			grass:    'https://static.wikia.nocookie.net/pokemongo/images/0/0a/Icon_Grass.png',
			ground:   'https://static.wikia.nocookie.net/pokemongo/images/7/71/Icon_Ground.png',
			ice:      'https://static.wikia.nocookie.net/pokemongo/images/5/52/Icon_Ice.png',
			normal:   'https://static.wikia.nocookie.net/pokemongo/images/4/43/Icon_Normal.png',
			poison:   'https://static.wikia.nocookie.net/pokemongo/images/2/26/Icon_Poison.png',
			psychic:  'https://static.wikia.nocookie.net/pokemongo/images/c/ce/Icon_Psychic.png',
			rock:     'https://static.wikia.nocookie.net/pokemongo/images/5/57/Icon_Rock.png',
			steel:    'https://static.wikia.nocookie.net/pokemongo/images/3/38/Icon_Steel.png',
			water:    'https://static.wikia.nocookie.net/pokemongo/images/6/65/Icon_Water.png'
		}
		let weather = 'unknown', slots = 5;
		let timeLeft;
		args.forEach(arg => {
			let num = ~~arg.replace(/slots?/, '');
			if (num) return slots = num;
			if (weathers[arg]) return weather = arg;
			const timeTry = tools.fromHumanTime(arg);
			if (timeTry) return timeLeft = timeTry;
			return Bot.roomReply(room, by, `Dunno what you meant by ${arg}, but I'll ignore it`);
		});
		const user = toID(by);
		if (!Bot.rooms[room].raids) Bot.rooms[room].raids = {};
		if (Bot.rooms[room].raids[user]) return Bot.say(room, `/adduhtml RAIDHTML${by}, ${Bot.rooms[room].raids[user].HTML()}`);
		if (data.pokedex.hasOwnProperty(mon)) mon = data.pokedex[mon];
		else return Bot.roomReply(room, by, 'Invalid Pokemon');
		Bot.rooms[room].raids[user] = {};
		const raid = Bot.rooms[room].raids[user];
		raid.pokemon = mon.name;
		raid.mon = toID(mon.name);
		raid.wb = mon.types.some(t => weathers[weather].includes(toID(t)))
		raid.host = user;
		raid.pings = (raid.wb ? Bot.rooms[room].users.filter(u => DB.get(toID(u))?.raids.hasOwnProperty(raid.mon)) : Bot.rooms[room].users.filter(u => DB.get(toID(u))?.raids.hasOwnProperty(raid.mon))).map(u => u.substr(1));
		raid.players = {};
		raid.slots = slots;
		raid.hostName = by.substr(1);
		raid.HTML = function (pings) {
			const players = Object.keys(raid.players).map(u => require('origindb')('data/POGO')('users').get(u));
			let joinHTML = players.length ? `<br/><table style="border:1px;border-collapse:collapse;"><tr><th style="width:100px;">IGN</th><th style="width:30px;">Lv</th><th style="width:120px;">Friend Code</th></tr>${players.map(u => `<tr><td>${tools.escapeHTML(u.ign)}</td><td>${u.level}</td><td>${u.code}</td></tr>`).join('')}</table><br/>` : '-<br/><br/>';
			if (players.length < slots && !raid.locked) joinHTML += `<button name="send" value="/botmsg ${Bot.status.nickName},${prefix}joinraid ${user}">Join</button>`;
			joinHTML += `<button name="send" value="/botmsg ${Bot.status.nickName},${prefix}leaveraid ${user}">Leave</button>`;
			let hiddenCodes = joinHTML.replace('<th style="width:120px;">Friend Code</th>', '').replace(/<td>\d+?<\/td>(?=<\/tr)/g, '');
			if (pings) Bot.say(room, `/notifyrank all, Raid notification!, ${raid.pokemon}, ${raid.pings.join(' ')}`);
			Bot.say(room, `/adduhtml RAIDHTML${by}, <div class="infobox" style="text-align:center;"><center><h2><psicon pokemon="${raid.mon}">${tools.colourize(raid.hostName)} is hosting a ${raid.wb ? 'Weather-Boosted ' : ''}<b>${raid.pokemon}</b> raid! <psicon pokemon="${raid.mon}"></h2>${weathers[weather].length ? `<small>Current boosted types: ${weathers[weather].map(type => `<img src="${icons[type]}" height="20" width="20" style="vertical-align:middle;"/>`).join(' ')}</small><br/><br/>` : ''}${hiddenCodes}${pings ? `<br/><br/><small>Pinged ${pings}</small>` : ''}</center></div>`);
			Bot.say(room, `/changeprivateuhtml ${by}, RAIDHTML${by}, <div class="infobox" style="text-align:center;"><center><h2><psicon pokemon="${raid.mon}">${tools.colourize(raid.hostName)} is hosting a ${raid.wb ? 'Weather-Boosted ' : ''}<b>${raid.pokemon}</b> raid! <psicon pokemon="${raid.mon}"></h2>${weathers[weather].length ? `<small>Current boosted types: ${weathers[weather].map(type => `<img src="${icons[type]}" height="20" width="20" style="vertical-align:middle;"/>`).join(' ')}</small><br/><br/>` : ''}${joinHTML}${pings ? `<br/><br/><small>Pinged ${pings}</small>` : ''}</center></div>`);
		}
		raid.endTime = Date.now() + (timeLeft || 100 * 60 * 1000);
		raid.timer = setTimeout(() => {
			Bot.say(room, `${Bot.rooms[room].raids[user].hostName}'s raid expired!`);
			delete Bot.rooms[room].raids[user];
		}, timeLeft || 100 * 60 * 1000);
		if (timeLeft) {
			if (timeLeft > 10 * 60 * 1000) raid.warningTimer = setTimeout(() => Bot.say(room, `@${raid.hostName} there's, like, 10 minutes left; probably host soon - if you're done, use \`\`${prefix}endraid\`\`!`), timeLeft - 10 * 60 * 1000);
			if (timeLeft > 5 * 60 * 1000) raid.fiveTimer = setTimeout(() => Bot.say(room, `@${raid.hostName} there's, like, 5 minutes left; people are likely to lose their passes if you raid any later. If you're done, use \`\`${prefix}endraid\`\`!`), timeLeft - 5 * 60 * 1000);
		}
		raid.hostFC = DBU.code;
		const pings = tools.escapeHTML(tools.listify(raid.pings));
		raid.HTML(pings);
	}
}