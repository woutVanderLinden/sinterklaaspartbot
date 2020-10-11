/************************
*        Utility        *
************************/

exports.quoteParse = function (quote) {
	return quote.split('\n').map(text => {
		if (!text) return;
		if (/^(|\[[0-2][0-9](\:[0-5][0-9]){1,2}\] )(|[\★\☆\-\$\+\%\@\*\#\&\~\^])[0-9A-Za-z][^\:]{1,17}\: .{1,}/.test(text)) {
			let first = text.match(/^(|\[[0-2][0-9](\:[0-5][0-9]){1,2}\] )(|[\★\☆\-\$\+\%\@\*\#\&\~\^])[0-9A-Za-z]/)[0];
			let subm = first.match(/(|[\★\☆\-\$\+\%\@\*\#\&\~\^])[0-9A-Za-z]$/)[0].length;
			let second = text.substr(first.length - subm);
			let third = second.match(/^(|[\★\☆\-\$\+\%\@\*\#\&\~\^])[0-9A-Za-z][^\:]{1,17}\:/)[0];
			let rank = ((['☆', '-', '$', '+', '%', '@', '*', '#', '&', '~', '★'].includes(third[0])) ? (third[0]) : '');
			return '<DIV class="chat chatmessage-partbot"><SMALL>' + first.substr(0, first.length - subm) + rank + '</SMALL>' + tools.colourize(third.substr(rank.length)) + '<EM>' + second.substr(third.length) + '</EM></DIV>';
		}
		if (/^(|\[[0-2][0-9](\:[0-5][0-9]){1,2}\] )• (|[\★\☆\-\$\+\%\@\*\#\&\~\^])\[[A-Za-z0-9][^\:]{1,17}\] .{1,}/.test(text)) {
			let darr = text.split('• ');
			let time = darr.shift();
			let first = darr.join('• ');
			let rank = ((['☆', '-', '$', '+', '%', '@', '*', '#', '&', '~', '★'].includes(first[0])) ? (first[0]) : '');
			let name = first.substr(rank.length + 1).split(']')[0];
			let stuff = first.substr(name.length + 2 + rank.length);
			return '<DIV class="chat chatmessage-partbot"><SMALL>' + time + '</SMALL>' + tools.colourize('• ', name) + '<EM><SMALL>' + rank + '</SMALL>' + name + '<I>' + stuff + '</I></EM></DIV>';
		}
		if (/^((?:(?:|[☆+%@*#&~$★\^-])[a-zA-Z0-9][^;]* joined\.?)|(?:(?:|[☆+%@*#&~$★\^-])[a-zA-Z0-9][^;]* left\.?)|(?:(?:|[★☆+%@*#&~$\^-])[a-zA-Z0-9][^;]* joined); (?:(?:|[★☆+%@*#&~$\^-])[a-zA-Z0-9][^;]* left\.?))$/.test(text)) {
			return '<DIV class="message"><SMALL style="color: #555555"> ' + text + '<BR></SMALL></DIV>';
		}
		if (/^\[[0-2][0-9](\:[0-5][0-9]){1,2}\] /.test(text)) {
			let first = text.match(/^\[[0-2][0-9](\:[0-5][0-9]){1,2}\] /)[0];
			return '<DIV class="chat chatmessage-partbot"><SMALL>' + first + '</SMALL>' + text.substr(first.length) + '</DIV>';
		}
		return text + '<BR>';
	}).join('');
}

exports.grantPseudo = function (user, room) {
	let rank = user.charAt(0);
	let name = toId(user);
	let preAuth = tools.rankLevel(user, room) - 2;
	switch (rank) {
		case '~': case '&': case '#': case '@': case '*': case '☆': case '★':
			if (!preAuth) Bot.auth.pseudoalpha.push(name);
			break;
		case '%': case '–': case '$':
			if (!preAuth) Bot.auth.pseudobeta.push(name);
			break;
		case '+':
			if ((room && !room.startsWith('groupchat-')) || (!room && !preAuth)) Bot.auth.pseudogamma.push(name);
			break;
		default:
			break;
	}
	return;
}


exports.aliasDB = require('./ALIASES/commands.json');
exports.pmAliasDB = require('./ALIASES/pmcommands.json');

exports.commandAlias = function (alias) {
	if (exports.aliasDB[toId(alias)]) alias = exports.aliasDB[toId(alias)];
	return toId(alias);
}

exports.pmCommandAlias = function (alias) {
	if (exports.pmAliasDB[toId(alias)]) alias = exports.pmAliasDB[toId(alias)];
	return toId(alias);
}

exports.spliceRank = function (user) {
	let rank = user.charAt(0);
	let name = toId(user);
	switch (rank) {
		case '~': case '&': case '#': case '@': case '*': case '☆':
			if (Bot.auth.pseudoalpha.includes(name)) Bot.auth.pseudoalpha.remove(name);
			break;
		case '%': case '–': case '$':
			if (Bot.auth.pseudobeta.includes(name)) Bot.auth.pseudobeta.remove(name);
			break;
		case '+':
			if (Bot.auth.pseudogamma.includes(name)) Bot.auth.pseudogamma.remove(name);;
			break;
		default:
			break;
	}
}

exports.rankLevel = function (user, room) {
	let name = toId(user);
	if (Bot.auth.admin.includes(name) || Bot.auth.adminalts.includes(name)) return 10;
	else if (Bot.auth.coder.includes(name) || Bot.auth.coderalts.includes(name)) return 9;
	else if (Bot.auth.locked.includes(name) || Bot.auth.lockedalts.includes(name)) return 1;
	else if (room && room !== 'global' && Bot.rooms[room] && Bot.rooms[room].auth && typeof Bot.rooms[room].auth[name] == 'number') return Bot.rooms[room].auth[name];
	else if (Bot.auth.alpha.includes(name) || Bot.auth.alphaalts.includes(name) || (room !== 'global' && Bot.rooms[room] && /^[~&#@\*]/.test(Bot.rooms[room].users.find(u => toId(u) === name)))) return 5;
	else if (Bot.auth.beta.includes(name) || Bot.auth.betaalts.includes(name) || (room !== 'global' && Bot.rooms[room] && /^[%]/.test(Bot.rooms[room].users.find(u => toId(u) === name)))) return 4;
	else if (Bot.auth.gamma.includes(name) || Bot.auth.gammaalts.includes(name) || (room !== 'global' && Bot.rooms[room] && /^[+\^]/.test(Bot.rooms[room].users.find(u => toId(u) === name)))) return 3;
	else return 2;
	return 0;
}

exports.hasPermission = function (user, rank, room) {
	let auth;
	if (typeof(user) === 'number') auth = user;
	else auth = tools.rankLevel(user, room);
	let req;
	switch (rank) {
		case 'admin': 
			req = 9;
			break;
		case 'coder': 
			req = 8;
			break;
		case 'alpha': 
			req = 4;
			break;
		case 'beta':
			req = 3;
			break;
		case 'gamma': 
			req = 2;
			break;
		case 'none': 
			req = 1;
			break;
		case 'locked': 
			req = 0;
			break;
		default: 
			req = 0;
	}
	if (auth > req) return true;
	else return false;
}

exports.canHTML = function (room) {
	if (!room) return false;
	if (!Bot.rooms[room]) return false;
	if (['*', '#', '&', '#', '★'].includes(Bot.rooms[room].rank)) return true;
	return false;
}

exports.listify = function (array) {
	if (!Array.isArray(array)) return array;
	let tarr = Array.from(array);
	if (!tarr.length) return '';
	if (tarr.length == 2) return tarr.join(' and ');
	let tarre = false;
	if (tarr.length > 1) tarre = tarr.pop();
	return tarr.join(', ') + ((array.length > 1) ? ', and ' + tarre : ((tarre) ? ' and ' + tarre : ''));
}

exports.uploadToPastie = function (text, callback) {
	if (typeof callback !== 'function') return false;
	let action = url.parse('https://pastie.io/documents');
	let options = {
		hostname: action.hostname,
		path: action.pathname,
		method: 'POST',
	};
	let request = https.request(options, response => {
		response.setEncoding('utf8');
		let data = '';
		response.on('data', chunk => {
			data += chunk;
		});
		response.on('end', () => {
			let key;
			try {
				let pageData = JSON.parse(data);
				key = pageData.key;
			} catch (e) {
				if (/^[^<]*<!DOCTYPE html>/.test(data)) {
					if (e.message.startsWith('Unexpected token < in JSON at position 0')) return callback('pastie.io is wonky at the moment. Surprisingly, this isn\'t PartMan\'s fault.');
					return callback('Cloudflare-related error uploading to Pastie: ' + e.message);
				} else {
					return callback('Unknown error uploading to Pastie: ' + e.message);
				}
			}
			callback('https://pastie.io/raw/' + key);
		});
	});
	request.on('error', error => console.log('Login error: ' + error.stack));
	if (text) request.write(text);
	request.end();
}

exports.uploadToLichess = function (text, callback) {
	if (typeof callback !== 'function') return false;
	let action = url.parse('https://lichess.org/api/import');
	let content = require('querystring').stringify({pgn: text});
	let options = {
		hostname: action.hostname,
		path: action.pathname,
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
			'Content-Length': content.length
		}
	}
	let request = https.request(options, response => {
		response.setEncoding('utf8');
		let data = '';
		response.on('data', chunk => {
			data += chunk;
		});
		response.on('end', () => {
			let url;
			try {
				url = JSON.parse(data);
			} catch (e) {}
			callback(url.url);
		});
	});
	request.on('error', error => console.log('Login error: ' + error.stack));
	request.write(content);
	request.end();
}

exports.warmup = function (room, commandName) {
	if (!cooldownObject[room] || !cooldownObject[room][commandName]) return;
	cooldownObject[room][commandName] = false;
	return;
}

exports.setCooldown = function (commandName, room, commandRequire) {
	if (!commandRequire || !commandName || !(typeof commandName === 'string') || !(typeof commandRequire === 'object') || Array.isArray(commandRequire)) return;
	if (!commandRequire.cooldown) commandRequire.cooldown = 10000;
	if (!cooldownObject[room]) cooldownObject[room] = {};
	cooldownObject[room][commandName] = true;
	setTimeout(tools.warmup, commandRequire.cooldown, room, commandName);
	return;
}

exports.toName = function (username) {
	username = toId(username);
	switch (username) {
		case 'partman': case 'vampart': case 'tealalte': return 'PartMan'; break;
		case 'tapiocatopic': return 'TapiocaTopic'; break;
		case 'unleashourpassion': case 'akasianse': case 'felucia': return 'Felucia'; break;
		case 'ironcrusher': return 'Iron Crusher'; break;
		case 'toppytopic': return 'ToppyTopic'; break;
		case '1v1sp': return '1v1sp'; break;
		case 'yeche': return 'Yech E'; break;
		case 'allfourtyone': return 'AllFourtyOne'; break;
		case 'vgjungle':	case 'lecremebrule': return 'Le Creme Brule'; break;
		case 'vggraveyard': return 'VG Graveyard'; break;
		case 'theseelgoesmeow': case 'revivaln': return 'Revival N'; break;
		case 'tlouk': return 'tlouk'; break;
		case 'armaldlo': return 'armaldlo'; break;
		case 'oceaney': return 'Ocean-ey'; break;
		case '666lesbian69': return '666lesbian69'; break;
		case 'tallydaorangez': return 'tallydaorangez=>'; break;
		case 'ayedan': return 'ayedan'; break;
		case 'princessnature': return 'Princess Nature'; break;
		case 'gmfc': return 'gmfc'; break;
		case 'malcolm24': return 'malcolm24'; break;
		case 'devourerofthots': return 'Devourer of Thots'; break;
		case 'suspectphilosophy': return 'Suspect Philosophy'; break;
		case 'vrbot': return 'VRBot'; break;
		case 'typebot': return 'TypeBot'; break;
		case 'snekbot': return 'SnekBot'; break;
		case 'uopisbot': return 'UOP is Bot'; break;
		case 'partbot': return 'PartBot'; break;
		case '1v1ombot': return '1v1 OM Bot'; break;
		case 'orangealte': return 'OrangeAlte'; break;
		case 'theimmortal': return 'The Immortal'; break;
		case 'xprienzo': return 'XpRienzo ☑◡☑'; break;
		case 'todorokidelta': return 'Todoroki (Delta)'; break;
		case 'theneverdying': return 'The Neverdying'; break;
		case 'praisegroudonism': return 'PrAiSe GrOuDoNiSm'; break;
		case 'hydro': return 'Hydro ~'; break;
		case 'savagecapotato49': return 'SavageCapotato_49'; break;
		case 'icyarticuno0970': return 'IcyArticuno0970'; break;
		case 'hanro': return 'hanro'; break;
		case 'fairyxlucy': return 'FairyxLucy'; break;
		default: return username.charAt(0).toUpperCase() + username.substr(1);
	}
}

exports.HSL = function (name, original) {
	name = toId(name);
	let out = {source: name, hsl: null};
	if (require('./DATA/config.js').Config.customcolors[name] && name !== 'constructor' && !original) {
		out.base = exports.HSL(name, true);
		name = require('./DATA/config.js').Config.customcolors[name];
		out.source = name;
	}
	let hash = require('crypto').createHash('md5').update(name, 'utf8').digest('hex');
	let H = parseInt(hash.substr(4, 4), 16) % 360;
	let S = parseInt(hash.substr(0, 4), 16) % 50 + 40;
	let L = Math.floor(parseInt(hash.substr(8, 4), 16) % 20 + 30);
	let C = (100 - Math.abs(2 * L - 100)) * S / 100 / 100;
	let X = C * (1 - Math.abs((H / 60) % 2 - 1));
	let m = L / 100 - C / 2;
	let R1;
	let G1;
	let B1;
	switch (Math.floor(H / 60)) {
		case 1:
			R1 = X;
			G1 = C;
			B1 = 0;
			break;
		case 2:
			R1 = 0;
			G1 = C;
			B1 = X;
			break;
		case 3:
			R1 = 0;
			G1 = X;
			B1 = C;
			break;
		case 4:
			R1 = X;
			G1 = 0;
			B1 = C;
			break;
		case 5:
			R1 = C;
			G1 = 0;
			B1 = X;
			break;
		case 0:
		default:
			R1 = C;
			G1 = X;
			B1 = 0;
			break;
	}
	let R = R1 + m;
	let G = G1 + m;
	let B = B1 + m;
	let lum = R * R * R * 0.2126 + G * G * G * 0.7152 + B * B * B * 0.0722;
	let HLmod = (lum - 0.2) * -150;
	if (HLmod > 18) HLmod = (HLmod - 18) * 2.5;
	else if (HLmod < 0) HLmod = (HLmod - 0) / 3;
	else HLmod = 0;
	let Hdist = Math.min(Math.abs(180 - H), Math.abs(240 - H));
	if (Hdist < 15) HLmod += (15 - Hdist) / 3;
	L += HLmod;
	out.hsl = [
		H,
		S,
		L
	]
	return out;
}

exports.colourize = function (text, name, useOriginal) {
	let ccjs = require('./DATA/config.js').Config.customcolors;
	if (!name) name = toId(text);
	if (ccjs[toId(name)] && !useOriginal) name = ccjs[name];
	let hash = require('crypto').createHash('md5').update(toId(name), 'utf8').digest('hex');;
	let H = parseInt(hash.substr(4, 4), 16) % 360;
	let S = parseInt(hash.substr(0, 4), 16) % 50 + 40;
	let L = Math.floor(parseInt(hash.substr(8, 4), 16) % 20 + 30);
	let C = (100 - Math.abs(2 * L - 100)) * S / 100 / 100;
	let X = C * (1 - Math.abs((H / 60) % 2 - 1));
	let m = L / 100 - C / 2;
	let R1;
	let G1;
	let B1;
	switch (Math.floor(H / 60)) {
	case 1: R1 = X; G1 = C; B1 = 0; break;
	case 2: R1 = 0; G1 = C; B1 = X; break;
	case 3: R1 = 0; G1 = X; B1 = C; break;
	case 4: R1 = X; G1 = 0; B1 = C; break;
	case 5: R1 = C; G1 = 0; B1 = X; break;
	case 0: default: R1 = C; G1 = X; B1 = 0; break;
	}
	let R = R1 + m;
	let G = G1 + m;
	let B = B1 + m;
	let lum = R * R * R * 0.2126 + G * G * G * 0.7152 + B * B * B * 0.0722;
	let HLmod = (lum - 0.2) * -150;
	if (HLmod > 18) HLmod = (HLmod - 18) * 2.5;
	else if (HLmod < 0) HLmod = (HLmod - 0) / 3;
	else HLmod = 0;
	let Hdist = Math.min(Math.abs(180 - H), Math.abs(240 - H));
	if (Hdist < 15) {
		HLmod += (15 - Hdist) / 3;
	}
	L += HLmod;
	return '<strong style=\"' + `color:hsl(${H},${S}%,${L}%);` + '\">' + text + '</strong>';
}

exports.HSLtoRGB = function (h, s, l) {
	// input [[0, 360], [0, 100], [0, 100]]
	let r, g, b;

	h /= 360;
	s /= 100;
	l /= 100;

	if (s == 0) r = g = b = l;
	else {
		let hue2rgb = (p, q, t) => {
			if(t < 0) t += 1;
			if(t > 1) t -= 1;
			if(t < 1 / 6) return p + (q - p) * 6 * t;
			if(t < 1 / 2) return q;
			if(t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
			return p;
		}

		let q = l < 0.5 ? l * (1 + s) : l + s - l * s;
		let p = 2 * l - q;
		r = hue2rgb(p, q, h + 1 / 3);
		g = hue2rgb(p, q, h);
		b = hue2rgb(p, q, h - 1 / 3);
	}

	return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

exports.RGBtoHEX = function (r, g, b) {
	return ('#' + r.toString(16) + g.toString(16) + b.toString(16)).toUpperCase();
}

exports.HSLtoHEX = function (h, s, l) {
	return exports.RGBtoHEX(...exports.HSLtoRGB(h, s, l));
}

exports.modeArray = function (arr) {
	if (!Array.isArray(arr)) return;
	let arrObj = {};
	arr.forEach(elem => {
		if (!arrObj['elem' + elem]) arrObj['elem' + elem] = 1;
		else arrObj['elem' + elem]++;
	});
	let maxF = Object.values(arrObj).sort((a, b) => b - a)[0];
	return Object.keys(arrObj).filter(elem => (arrObj[elem] === maxF)).map(elem => elem.substr(4)).sort();
}

exports.humanTime = function (millis) {
	if (typeof millis === 'string') millis = parseInt(millis);
	if (!(typeof millis === 'number')) return;
	let time = {};
	time.year = Math.floor(millis / (365*24*60*60*1000));
	millis %= (365*24*60*60*1000);
	time.week = Math.floor(millis / (7*24*60*60*1000));
	millis %= (7*24*60*60*1000);
	time.day = Math.floor(millis / (24*60*60*1000));
	millis %= (24*60*60*1000);
	time.hour = Math.floor(millis / (60*60*1000));
	millis %= (60*60*1000);
	time.minute = Math.floor(millis / (60*1000));
	millis %= (60*1000);
	time.second = Math.floor(millis / (1000));
	millis %= (1000);
	time.millisecond = millis;
	let output = [];
	let foundFirst = false;
	let foundSecond = false;
	Object.keys(time).forEach(val => {
		if (foundFirst && !foundSecond) {
			if (time[val] === 0);
			else output.push(time[val] + ' ' + val + ((time[val] === 1)?'':'s'));
			foundSecond = true;
		}
		else {
			if (time[val] && !foundSecond) {
				foundFirst = true;
				output.push(time[val] + ' ' + val + ((time[val] === 1)?'':'s'));
			}
		}
	});
	return output.join(' and ');
}

exports.getSetsFrom = function (link) {
	switch (link.split('.')[0]) {
		case 'pokepast': {
			(link.endsWith('/json')) ? link : link += '/json';
			require('request')(link, (error, response, body) => {
				if (error) throw error;
				let data = JSONS.parse(body).paste;
				return data.replace(/\r\n/g, '');
			});
		}
	}
	return output;
}

exports.runEarly = function (timer) {
	if (!timer) return false;
	timer._onTimeout(...timer._timerArgs);
	clearTimeout(timer);
	return true;
}

exports.getPorts = function (name, source) {
	if (!Array.isArray(source)) return null;
	let front = source.filter(elem => {
		if (!elem) return false;
		elem = toId(elem);
		if (name.startsWith(elem)) return true;
		for (let i = 2; i < elem.length; i++) {
			if (name.startsWith(elem.slice(elem.length - i, elem.length))) return true;
		}
		return false;
	});
	let end = source.filter(elem => {
		if (!elem) return false;
		elem = toId(elem);
		if (elem.startsWith(name)) return true;
		for (let i = 2; i < name.length; i++) {
			if (elem.startsWith(name.slice(name.length - i, name.length))) return true;
		}
		return false;
	});
	return [front.sort(), end.sort()];
}

exports.board = require('./TABLE/boards.js').render;

exports.getEffectiveness = function (mon1, mon2) {
	if (Array.isArray(mon1)) mon1 = mon1.map(t => tools.toName(toId(t)));
	if (Array.isArray(mon2)) mon2 = mon2.map(t => tools.toName(toId(t)));
	if (typeof(mon1) == 'string') {
		if (data.pokedex[toId(mon1)]) mon1 = data.pokedex[toId(mon1)].types;
		else if (typelist.includes(mon1.toLowerCase())) mon1 = [tools.toName(mon1)];
	}
	if (typeof(mon2) == 'string') {
		if (data.pokedex[toId(mon2)]) mon2 = data.pokedex[toId(mon2)].types;
		else if (typelist.includes(mon2.toLowerCase())) mon2 = [tools.toName(mon2)];
	}
	if (!Array.isArray(mon1) || !Array.isArray(mon2)) return null;
	let x = 1;
	mon1.forEach(offType => {
		if (!data.typechart[offType]) return;
		mon2.forEach(defType => {
			if (!data.typechart[defType]) return;
			switch (data.typechart[defType].damageTaken[offType]) {
				case 0: x *= 1; break;
				case 1: x *= 2; break;
				case 2: x *= 0.5; break;
				case 3: x *= 0; break;
			}
		});
	});
	return x;
}

exports.toSprite = function (mon, full) {
	const cds = require('./DATA/iconcoords.json');
	if (typelist.includes(toId(mon))) {
		mon = toId(mon);
		mon = mon[0].toUpperCase() + mon.substr(1);
		return `<img src="https://play.pokemonshowdown.com/sprites/types/${mon}.png" alt="${mon}" class="pixelated" width="32" height="14">`;
	}
	if (!cds[toId(mon)]) return mon;
	mon = toId(mon);
	if (!full) return `<span class="picon" style="background: transparent url('https://play.pokemonshowdown.com/sprites/pokemonicons-sheet.png?v2') no-repeat scroll ${cds[mon][0]}px ${cds[mon][1]}px;"></span>`;
	return `<span class="picon" style="background: transparent url('https://play.pokemonshowdown.com/sprites/pokemonicons-sheet.png?v2') no-repeat scroll ${cds[mon][0]}px ${cds[mon][1]}px; display: inline-block; width: 40px; height: 30px;"></span>`;
}


/************************
*         Shops         *
************************/

exports.loadShops = function (...shops) {
	if (!shops.length) shops = fs.readdirSync('./data/SHOPS').map(shop => shop.slice(0, shop.length - 5));
	shops.map(shop => shop.toLowerCase().replace(/[^a-z0-9-]/g, ''));
	shops.forEach(shop => {
		if (!Bot.rooms[shop]) return console.log(`Not in ${shop} to load Shop.`);
		fs.readFile(`./data/SHOPS/${shop}.json`, 'utf8', (err, file) => {
			if (err) return;
			let dat = JSON.parse(file);
			Bot.rooms[shop].shop = dat;
			console.log(`Loaded the ${Bot.rooms[shop].title} Shop.`);
		});
	});
}

exports.updateShops = function (...shops) {
	if (!shops.length) shops = fs.readdirSync('./data/SHOPS').map(shop => shop.slice(0, shop.length - 5));
	shops.map(shop => shop.toLowerCase().replace(/[^a-z0-9-]/g, ''));
	shops.forEach(shop => {
		if (!Bot.rooms[shop]) return console.log(`Not in ${shop} to update Shop.`);
		fs.writeFile(`./data/SHOPS/${shop}.json`, JSON.stringify(Bot.rooms[shop].shop, null, 2), (err) => {
			if (err) return;
		});
	});
}

exports.loadLB = function (...rooms) {
	if (!rooms.length) rooms = fs.readdirSync('./data/POINTS').map(room => room.slice(0, room.length - 5));
	rooms.map(room => room.toLowerCase().replace(/[^a-z0-9-]/g, ''));
	rooms.forEach(room => {
		if (!Bot.rooms[room]) return console.log(`Not in ${room} to load the leaderboard.`);
		fs.readFile(`./data/POINTS/${room}.json`, 'utf8', (err, file) => {
			if (err) return;
			let dat = JSON.parse(file);
			Bot.rooms[room].lb = dat;
			console.log(`Loaded the ${Bot.rooms[room].title} leaderboard.`);
		});
	});
}

exports.updateLB = function (...rooms) {
	if (!rooms.length) rooms = fs.readdirSync('./data/POINTS').map(room => room.slice(0, room.length - 5));
	rooms.map(room => room.toLowerCase().replace(/[^a-z0-9-]/g, ''));
	rooms.forEach(room => {
		if (!Bot.rooms[room]) return console.log(`Not in ${room} to update leaderboard.`);
		fs.writeFile(`./data/POINTS/${room}.json`, JSON.stringify(Bot.rooms[room].lb, null, 2), (err) => {
			if (err) return;
		});
	});
}

exports.addPoints = function (type, username, points, room) {
	return new Promise ((resolve, reject) => {
		if (typeof type !== 'number') return reject(new Error ('Type must be a number.'));
		let user = toId(username);
		if (!room || !Bot.rooms[room].lb) return reject(new Error ('Invalid room / no leaderboard'));
		if (type >= Bot.rooms[room].lb.points.length) return reject(new Error ('Type is too high!'));
		if (!Bot.rooms[room].lb.users[user]) Bot.rooms[room].lb.users[user] = {name: username, points: Array.from({length: Bot.rooms[room].lb.points.length}).map(t => 0)};
		Bot.rooms[room].lb.users[user].points[type] += points;
		tools.updateLB(room);
		return resolve(username);
	});
}


/************************
*        Games          *
************************/

exports.Chess = require('./GAMES/chess.js').Chess;
exports.CR = require('./GAMES/chainreaction.js').CR;
exports.Othello = require('./GAMES/othello.js').Othello;
exports.Scrabble = require('./GAMES/scrabble.js').Scrabble;
exports.LO = require('./GAMES/lightsout.js').LO;
exports.Mastermind = require('./GAMES/mastermind.js').Mastermind;

exports.newDeck = function (type, amt) {
	if (!type) type = 'regular';
	type = toId(type);
	switch (type) {
		case 'regular': case 'reg': {
			if (!amt) amt = 1;
			let deck = [];
			let suits = ['H', 'S', 'D', 'C'];
			let ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
			for (let i = 0; i < amt; i++) suits.forEach(suit => ranks.forEach(rank => deck.push(rank + suit)));
			return deck;
			break;
		}
		case 'explodingvoltorb': case 'ev': {
			if (!amt || amt < 2 || amt > 5) return null;
			let deck = [], post = [];
			for (let i = 0; i < 5; i++) deck.push('snorlax');
			for (let i = 0; i < 4; i++) deck.push('meowth');
			for (let i = 0; i < 4; i++) deck.push('liepard');
			for (let i = 0; i < 4; i++) deck.push('skitty');
			for (let i = 0; i < 4; i++) deck.push('lugia');
			for (let i = 0; i < 3; i++) deck.push('espurr');
			for (let i = 0; i < 7; i++) deck.push('flareon');
			for (let i = 0; i < 7; i++) deck.push('jolteon');
			for (let i = 0; i < 7; i++) deck.push('vaporeon');
			for (let i = 0; i < 7; i++) deck.push('espeon');
			for (let i = 0; i < 7; i++) deck.push('umbreon');
			for (let i = 1; i < amt; i++) post.push('voltorb');
			for (let i = 0; i < 6; i++) post.push('quagsire')
			return [deck, post];
			break;
		}
	}
}

exports.toShuffleImage = function (mon) {
	mon = mon.toLowerCase();
	switch (mon) {
		case 'espeon': return 'https://vignette.wikia.nocookie.net/pkmnshuffle/images/e/ef/Espeon.png';
		case 'espurr': return 'https://vignette.wikia.nocookie.net/pkmnshuffle/images/9/99/Espurr.png';
		case 'flareon': return 'https://vignette.wikia.nocookie.net/pkmnshuffle/images/1/17/Flareon.png';
		case 'jolteon': return 'https://vignette.wikia.nocookie.net/pkmnshuffle/images/1/1e/Jolteon.png';
		case 'liepard': return 'https://vignette.wikia.nocookie.net/pkmnshuffle/images/3/3b/Liepard.png';
		case 'lugia': return 'https://vignette.wikia.nocookie.net/pkmnshuffle/images/a/a7/Lugia.png';
		case 'meowth': return 'https://vignette.wikia.nocookie.net/pkmnshuffle/images/9/99/Meowth.png';
		case 'quagsire': return 'https://vignette.wikia.nocookie.net/pkmnshuffle/images/1/1b/Quagsire.png';
		case 'skitty': return 'https://vignette.wikia.nocookie.net/pkmnshuffle/images/f/f0/Skitty.png';
		case 'snorlax': return 'https://vignette.wikia.nocookie.net/pkmnshuffle/images/0/0b/Snorlax.png';
		case 'umbreon': return 'https://vignette.wikia.nocookie.net/pkmnshuffle/images/9/9f/Umbreon.png';
		case 'vaporeon': return 'https://vignette.wikia.nocookie.net/pkmnshuffle/images/f/fc/Vaporeon.png';
		case 'voltorb': return 'https://vignette.wikia.nocookie.net/pkmnshuffle/images/8/80/Voltorb.png';
		default: return '';
	}
}

exports.deal = function (players) {
	let deck, post, out = {players: {}}, cards = exports.newDeck('ev', players.length);
	if (!cards) return null;
	[deck, post] = cards;
	deck.shuffle();
	players.forEach(player => {
		out.players[toId(player)] = [post.pop()];
		for (let i = 0; i < 7; i++) out.players[toId(player)].push(deck.pop());
	});
	out.deck = deck.concat(post).shuffle();
	return out;
}

exports.cardFrom = function (str) {
	if (data.pokedex[str]) {
		return data.pokedex[str].name;
	}
	if (!str || !/^(?:[AJQK2-9]|10)[HSDC]$/.test(str)) return null;
	let arr = str.split(''), suit = arr.pop();
	switch (suit) {
		case 'H': suit = '♡'; break;
		case 'S': suit = '♠'; break;
		case 'D': suit = '♢'; break;
		case 'C': suit = '♣'; break;
		default: return null; break;
	}
	return [arr.join(''), suit];
}

exports.cardWeight = function (card) {
	if (!Array.isArray(card)) card = tools.cardFrom(card);
	if (!card) return null;
	if (/\d/.test(card[0])) return parseInt(card);
	if (['J', 'Q', 'K'].includes(card[0])) return 10;
	if (card[0] === 'A') return 1;
	return null;
}

exports.sumBJ = function (cards) {
	if (!Array.isArray(cards)) return null;
	if (typeof(cards[0]) === 'string') cards = cards.map(card => tools.cardFrom(card));
	let sum = 0, aces = 0;
	cards.forEach(card => {
		let wt = tools.cardWeight(card);
		if (!wt) return;
		if (wt == 1) {
			wt = 11;
			aces++;
		}
		return sum += wt;
	});
	while (sum > 21 && aces > 0) {
		sum -= 10;
		aces--;
	}
	return sum;
}

exports.getActions = function (hand) {
	if (!hand || !Array.isArray(hand)) return null;
	let actions = [], allFive = true;
	if (hand.includes('skitty')) actions.push('Skitty');
	if (hand.includes('meowth')) actions.push('Meowth');
	if (hand.includes('liepard')) actions.push('Liepard');
	if (hand.includes('lugia')) actions.push('Lugia');
	if (hand.includes('espurr')) actions.push('Espurr');
	['espeon', 'flareon', 'jolteon', 'umbreon', 'vaporeon'].forEach(vee => {
		let dupe = hand.filter(m => m == vee).length;
		if (dupe >= 2) actions.push(`2x${data.pokedex[vee].name}`);
		if (dupe >= 3) actions.push(`3x${data.pokedex[vee].name}`);
		if (!hand.includes(vee)) allFive = false;
	});
	if (allFive) actions.push('Eevee Power');
	return actions;
}

exports.handHTML = function (hand) {
	if (!hand || !Array.isArray(hand)) return null;
	return '<CENTER> ' + hand.filter(card => ['espeon', 'espurr', 'flareon', 'jolteon', 'liepard', 'lugia', 'meowth', 'quagsire', 'skitty', 'snorlax', 'umbreon', 'vaporeon', 'voltorb'].includes(card)).map(card => `<IMG src="${exports.toShuffleImage(card)}" height="48" width="48">`).join('') + '</CENTER>';
}

exports.toPGN = function (game) {
	let out = [];
	game.moves.forEach((move, index) => {
		if (index % 2 == 0) out.push((index / 2 + 1) + '.');
		out.push(move);
	});
	out.push(game.result);
	return `[White "${game.W.name.replace(/"/g, '')}"]\n[Black "${game.B.name.replace(/"/g, '')}"]\n\n` + out.join(' ');
}

exports.scrabblify = function (text) {
	if (!typeof text === 'string') return 0;
	let tarr = text.toUpperCase().split('');
	function points(letter) {
		if (!typeof letter === 'string' || !letter.length === 1) return 0;
		if ('EAOTINRSLU'.includes(letter)) return 1;
		else if ('DG'.includes(letter)) return 2;
		else if ('CMBP'.includes(letter)) return 3;
		else if ('HFWYV'.includes(letter)) return 4;
		else if ('K'.includes(letter)) return 5;
		else if ('JX'.includes(letter)) return 8;
		else if ('ZQ'.includes(letter)) return 10;
		else if ('1234567890'.includes(letter)) return parseInt(letter);
		else return 0;
	}
	return tarr.reduce((x, y) => {return x + points(y)}, 0);
}


/************************
*      Prototypes       *
************************/

String.prototype.replaceAll = function (text, repl) {
	if (!typeof text === 'string' || !typeof repl === 'string') return;
	return this.split(text).join(repl);
}

String.prototype.frequencyOf = function (text) {
	if (!typeof text === 'string') return;
	return this.split(text).length - 1;
}

Array.prototype.shuffle = function () {
	for (let i = this.length - 1; i > 0; i--) {
		let j = Math.floor(Math.random() * (i + 1));
		[this[i], this[j]] = [this[j], this[i]];
	}
	return Array.from(this);
}

Array.prototype.remove = function (...terms) {
	let out = true;
	terms.forEach(term => {
		if (this.includes(term)) this.splice(this.indexOf(term), 1);
		else out = false;
	});
	return out;
}

Array.prototype.random = function (amount) {
	if (!amount || typeof amount !== 'number') return this[Math.floor(Math.random() * this.length)];
	let sample = Array.from(this), i = 0, out = [];
	while (sample.length && i++ < amount) {
		let term = sample[Math.floor(Math.random() * sample.length)];
		out.push(term);
		sample.remove(term);
	}
	return out;
}

Array.prototype.removeDuplicates = function () {
	let out = [];
	this.forEach(element => {
		if (!out.includes(element)) out.push(element);
	});
	return out;
}
