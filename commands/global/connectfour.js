function sendEmbed (room, winner, players, board, logs, rows) {
	Bot.say(room, `http://partbot.partman.co.in/connectfour/${logs}`);
	if (!['boardgames'].includes(room)) return;
	board = Array.from({length: board.length}).map((col, x) => Array.from({length: rows}).map((_, y) => board[x][y] || 'E'));
	board.forEach(col => col.reverse());
	let Embed = require('discord.js').MessageEmbed, embed = new Embed();
	embed.setColor('#0080ff').setAuthor('Connect Four - Room Match').setTitle((winner === 'Y' ? `**${players.Y}**` : players.Y) + ' vs ' + (winner === 'R' ? `**${players.R}**` : players.R)).setURL(`http://partbot.partman.co.in/connectfour/${logs}`).addField('\u200b', board[0].map((col, i) => board.map(row => row[i])).map(row => row.map(cell => {
		switch (cell) {
			case 'Y': {
				return ':yellow_circle:';
				break;
			}
			case 'R': {
				return ':red_circle:';
				break;
			}
			default: return ':blue_circle:';
		}
	}).join('')).join('\n'));
	client.channels.cache.get("576488243126599700").send(embed).catch(e => {
		Bot.say(room, 'Unable to send the game to the Discord because ' + e.message);
		Bot.log(e);
	});
}

function runMoves (run, info, game) {
	const room = game.room, id = game.id;
	switch (run) {
		case 'join': {
			let {user, side} = info;
			game[side].player = toID(user);
			game[side].name = user.replace(/[<>]/g, '');
			if (game.Y.player && game.R.player) return runMoves('start', null, game);
			let html = `<hr /><h1>Connect Four Signups are active!</h1>${["Y", "R"].filter(side => !game[side].player).map(side => `<button name="send" value="/botmsg ${Bot.status.nickName}, ${prefix}connectfour ${room}, join ${id} ${side === 'Y' ? 'Yellow' : 'Red'}">${side === 'Y' ? 'Yellow' : 'Red'}</button>`).join('&nbsp;')}<hr />`;
			return Bot.say(room, `/adduhtml CONNECTFOUR-${id}, ${html}`);
			break;
		}
		case 'start': {
			game.started = true;
			Bot.say(room, `Connect Four: ${game.Y.name} vs ${game.R.name} GOGO`);
			game.spectators.forEach(spect => Bot.sendHTML(spect, `<center><h1>${game[game.turn].name}'s Turn (${game.turn})</h1>${game.boardHTML()}</center>`));
			Bot.say(room, `/sendhtmlpage ${game.Y.player}, Connect Four + ${room} + ${id}, ${game.turn === "Y" ? "<h1 style=\"text-align: center;\">Your turn!</h1>" : "<h1 style=\"text-align: center;\">Waiting for opponent...</h1>"}<center>${game.boardHTML(true)}</center>`);
			Bot.say(room, `/sendhtmlpage ${game.R.player}, Connect Four + ${room} + ${id}, ${game.turn === "R" ? "<h1 style=\"text-align: center;\">Your turn!</h1>" : "<h1 style=\"text-align: center;\">Waiting for opponent...</h1>"}<center>${game.boardHTML(true)}</center>`);
			setTimeout(() => {
				Bot.say(room, `/highlighthtmlpage ${game.Y.player}, Connect Four + ${room} + ${id}, Your turn!`);
			}, 1000);
			Bot.say(room, `/adduhtml CONNECTFOUR-${id},<hr />${tools.colourize(game.Y.name)} vs ${tools.colourize(game.R.name)}! <div style="text-align: right; display: inline-block; font-size: 0.9em; float: right;"><button name="send" value="/botmsg ${Bot.status.nickName}, ${prefix}connectfour ${room} spectate ${id}">Watch!</button></div><hr />`);
			break;
		}
		case 'move': {
			game.spectators.forEach(spect => Bot.say(room, `/sendhtmlpage ${spect}, Connect Four + ${room} + ${id}, <center><h1>${game[game.turn].name}'s Turn (${game.turn})</h1>${game.boardHTML()}</center>`));
			Bot.say(room, `/sendhtmlpage ${game.Y.player}, Connect Four + ${room} + ${id}, ${game.turn === "Y" ? "<h1 style=\"text-align: center;\">Your turn!</h1>" : "<h1 style=\"text-align: center;\">Waiting for opponent...</h1>"}<center>${game.boardHTML(true)}</center>`);
			Bot.say(room, `/sendhtmlpage ${game.R.player}, Connect Four + ${room} + ${id}, ${game.turn === "R" ? "<h1 style=\"text-align: center;\">Your turn!</h1>" : "<h1 style=\"text-align: center;\">Waiting for opponent...</h1>"}<center>${game.boardHTML(true)}</center>`);
			setTimeout(() => {
				Bot.say(room, `/highlighthtmlpage ${game[game.turn].player}, Connect Four + ${room} + ${id}, Your turn!`);
			}, 1000);
			break;
		}
		case 'end': {
			let players = {Y: game.Y.name, R: game.R.name}, board = game.board, logs = game.moves.join(''), winner = info, rows = game.rows;
			fs.unlink(`./data/BACKUPS/connectfour-${room}-${id}.json`, e => {});
			Bot.say(room, `/adduhtml CONNECTFOUR-${Date.now()},<center>${game.boardHTML(false, true)}</center>`);
			game.spectators.forEach(spect => Bot.say(room, `/sendhtmlpage ${spect}, Connect Four + ${room} + ${id}, <center><h1>Game over!</h1>${game.boardHTML(false)}</center>`));
			Bot.say(room, `/sendhtmlpage ${game.Y.player}, Connect Four + ${room} + ${id}, <center><h1>Game over!</h1>${game.boardHTML()}</center>`);
			Bot.say(room, `/sendhtmlpage ${game.R.player}, Connect Four + ${room} + ${id}, <center><h1>Game over!</h1>${game.boardHTML()}</center>`);
			Bot.say(room, winner ? `${game[winner].name} (${winner === 'Y' ? 'Yellow' : 'Red'}) won!` : 'The game ended as a draw!');
			delete Bot.rooms[room].connectfour[id];
			sendEmbed(room, winner, players, board, logs, rows);
			return;
			break;
		}
		case 'resign': {
			let loser = info, players = {Y: game.Y.name, R: game.R.name}, board = game.board, logs = game.moves.join(''), winner = loser === 'Y' ? 'R' : 'Y', rows = game.rows;
			fs.unlink(`./data/BACKUPS/connectfour-${room}-${id}.json`, e => {});
			Bot.say(room, `/adduhtml CONNECTFOUR-${Date.now()},<center>${game.boardHTML(false, true)}</center>`);
			game.spectators.forEach(spect => Bot.say(room, `/sendhtmlpage ${spect}, Connect Four + ${room} + ${id}, <center><h1>Resigned.</h1>${game.boardHTML(false)}</center>`));
			Bot.say(room, `/sendhtmlpage ${game.Y.player}, Connect Four + ${room} + ${id}, <center><h1>Resigned.</h1>${game.boardHTML()}</center>`);
			Bot.say(room, `/sendhtmlpage ${game.R.player}, Connect Four + ${room} + ${id}, <center><h1>Resigned.</h1>${game.boardHTML()}</center>`);
			Bot.say(room, `${players[loser]} resigned.`);
			delete Bot.rooms[room].connectfour[id];
			sendEmbed(room, winner, players, board, logs, rows);
			return;
			break;
		}
	}
	fs.writeFile(`./data/BACKUPS/connectfour-${room}-${id}.json`, JSON.stringify(game), e => {
		if (e) console.log(e);
	});
}

module.exports = {
	help: `The Connect Four module. Use \`\`${prefix}connectfour new\`\` to make a game, and \`\`${prefix}connectfour spectate\`\` to watch. To resign, use \`\`${prefix}counnectfour resign\`\`. The rules are simple - players take turns trying to get four in a row!`,
	permissions: 'none',
	commandFunction: function (Bot, room, time, by, args, client, isPM) {
		if (!args[0]) args.push('help');
		switch (args[0].toLowerCase()) {
			case 'help': case 'h': {
				if (tools.hasPermission(by, 'gamma', room) && !isPM) return Bot.say(room, this.help);
				else Bot.roomReply(room, by, this.help);
				break;
			}
			case 'new': case 'n': {
				if (!tools.hasPermission(by, 'gamma', room)) return Bot.roomReply(room, by, 'Access denied.');
				if (isPM) return Bot.roomReply(room, by, `Thou art stinky, do this in a chatroom`);
				if (!tools.canHTML(room)) return Bot.say(room, 'I can\'t do that here. Ask an RO to promote me or something.');
				if (!Bot.rooms[room].connectfour) Bot.rooms[room].connectfour = {};
				const id = Date.now();
				Bot.rooms[room].connectfour[id] = GAMES.create('connectfour', id, {}, room);
				Bot.say(room, `/adduhtml CONNECTFOUR-${id}, <hr/><h1>Connect Four Signups have begun!</h1><button name="send" value="/botmsg ${Bot.status.nickName}, ${prefix}connectfour ${room}, join ${id} Yellow">Yellow</button><button name="send" value="/botmsg ${Bot.status.nickName}, ${prefix}connectfour ${room}, join ${id} Red">Red</button><button name="send" value="/botmsg ${Bot.status.nickName}, ${prefix}connectfour ${room}, join ${id} Any">Random</button><hr/>`);
				Bot.say(room, '/notifyrank all, Connect Four, A new game of Connect Four has been created!, A new game of Connect Four has been created.');
				return;
				break;
			}
			case 'join': case 'j': {
				if (!Bot.rooms[room].connectfour) return Bot.roomReply(room, by, 'There isn\'t an active Connect Four game in this room.');
				if (!args[1]) return Bot.roomReply(room, by, 'Please specify the ID / side.');
				let id, side, user = toID(by);
				if (args[2] && parseInt(args[1])) {
					id = args[1];
					side = args[2][0].toUpperCase();
					if (side === 'A') side = ['Y', 'R'].random();
					if (!["Y", "R"].includes(side)) return Bot.roomReply(room, by, "I only accept yellow and red. (insert snarky comment)");
				}
				else if (Object.keys(Bot.rooms[room].connectfour).length === 1) {
					id = Object.keys(Bot.rooms[room].connectfour)[0];
					side = args[1][0].toUpperCase();
					if (side === 'A') side = ['Y', 'R'].random();
					if (!["Y", "R"].includes(side)) return Bot.roomReply(room, by, "I only accept yellow and red. (insert snarky comment)");
				}
				else {
					side = args[1][0].toUpperCase();
					if (side === 'A') side = ['Y', 'R'].random();
					if (!["Y", "R"].includes(side)) return Bot.roomReply(room, by, "I only accept yellow and red. (insert snarky comment)");
					id = Object.keys(Bot.rooms[room].connectfour).find(k => {
						let game = Bot.rooms[room].connectfour[k];
						return game && !game.started && !game[side].player;
					});
					if (!id) return Bot.roomReply(room, by, "Sorry, unable to find any open games.");
				}
				let game = Bot.rooms[room].connectfour[id];
				if (!game) return Bot.roomReply(room, by, "Nope. BOOP");
				if (game.started) return Bot.roomReply(room, by, 'Too late!');
				if (game[side].player) return Bot.roomReply(room, by, "Sorry, already taken!");
				const other = side === 'Y' ? 'R' : 'Y';
				if (game[other].player === user) return Bot.roomReply(room, by, "~~You couldn't find anyone else to fight you? __Really__?~~");
				Bot.say(room, `${by.substr(1)} joined Connect Four (#${id}) as ${side === 'Y' ? 'Yellow' : 'Red'}!`);
				runMoves('join', {user: by.substr(1), side: side}, game);
				break;
			}
			case 'play': case 'move': case 'click': {
				if (!Bot.rooms[room].connectfour) return Bot.roomReply(room, by, 'There isn\'t an active Connect Four game in this room.');
				if (!args[1]) return Bot.roomReply(room, by, unxa);
				args.shift();
				if (!Object.keys(Bot.rooms[room].connectfour).length) return Bot.roomReply(room, by, "No games are active.");
				let id, user = toID(by);
				if (args[0] && /^\d+$/.test(args[0].trim())) id = args.shift().trim();
				else id = Object.keys(Bot.rooms[room].connectfour).find(k => {
					let game = Bot.rooms[room].connectfour[k];
					return game && game.started && !game[game.turn].player === user;
				});
				if (!id) return Bot.roomReply(room, by, "Unable to find the game you meant to play in.");
				let game = Bot.rooms[room].connectfour[id];
				if (!game) return Bot.roomReply(room, by, "Not a valid ID.");
				if (!game.started) return Bot.roomReply(room, by, 'OI, IT HASN\'T STARTED!');
				if (!(game[game.turn].player === toID(by))) return;
				let coords = args.join('').split(',');
				if (coords.length !== 1) return Bot.roomReply(room, by, "I need one coordinate to play - why not click on the board instead?");
				coords = coords.map(t => parseInt(toID(t)));
				if (isNaN(coords[0])) return Bot.roomReply(room, by, "Invalid coordinate. ;-;");
				game.drop(coords[0]).then(res => {
					delete game.Y.isResigning;
					delete game.R.isResigning;
					if (res) return runMoves('end', res, game);
					if (game.board.find(col => col.length < game.rows)) return runMoves('move', null, game);
					return runMoves('end', false, game);
				}).catch(why => Bot.roomReply(room, by, why));
				break;
			}
			case 'substitute': case 'sub': {
				if (!tools.hasPermission(by, 'gamma', room)) return Bot.roomReply(room, by, 'Access denied.');
				if (!Bot.rooms[room].connectfour) return Bot.roomReply(room, by, 'This room does not have any Connect Four games.');
				args.shift();
				let id, cargs;
				if (!Object.keys(Bot.rooms[room].connectfour).length) return Bot.roomReply(room, by, "No games are active.");
				if (/^[^a-zA-Z]+$/.test(args[0])) id = toID(args.shift());
				else if (Object.keys(Bot.rooms[room].connectfour).length === 1) id = Object.keys(Bot.rooms[room].connectfour)[0];
				else {
					cargs = args.join(' ').split(/\s*,\s*/);
					if (cargs.length !== 2) return Bot.roomReply(room, by, "I NEED TWO NAMES GIVE ME TWO NAMES");
					let id1 = toID(cargs[0]), id2 = toID(cargs[1]);
					id = Object.keys(Bot.rooms[room].connectfour).find(k => {
						let game = Bot.rooms[room].connectfour[k], ps = [game.Y.player, game.R.player];
						return game && game.started && ((ps.includes(id1) && !ps.includes(id2)) || (!ps.includes(id1) && ps.includes(id2)));
					});
				}
				cargs = args.join(' ').replace(/[<>]/g, '').split(/\s*,\s*/);
				if (cargs.length !== 2) return Bot.roomReply(room, by, "I NEED TWO NAMES GIVE ME TWO NAMES");
				if (!id) return Bot.roomReply(room, by, "Sorry, I couldn't find a valid game to sub.");
				let game = Bot.rooms[room].connectfour[id];
				if (!game.started) return Bot.roomReply(room, by, 'Excuse me?');
				cargs = cargs.map(carg => carg.trim());
				let users = cargs.map(carg => toID(carg));
				if ((users.includes(game.Y.player) && users.includes(game.R.player)) || (!users.includes(game.Y.player) && !users.includes(game.R.player))) return Bot.say(room, 'Those users? Something\'s wrong with those...');
				if ([game.Y.player, game.R.player].includes(toID(by)) && !tools.hasPermission(by, 'coder')) return Bot.say(room, "Hah! Can't sub yourself out.");
				if (users.includes(game.Y.player)) {
					if (users[0] == game.Y.player) {
						Bot.say(room, `${game.Y.name} was subbed with ${cargs[1]}!`);
						game.Y.player = users[1];
						game.Y.name = cargs[1];
						ex = users[0];
						add = users[1];
					}
					else {
						Bot.say(room, `${game.Y.name} was subbed with ${cargs[0]}!`);
						game.Y.player = users[0];
						game.Y.name = cargs[0];
						ex = users[1];
						add = users[0];
					}
				}
				else {
					if (users[0] == game.R.player) {
						Bot.say(room, `${game.R.name} was subbed with ${cargs[1]}!`);
						game.R.player = users[1];
						game.R.name = cargs[1];
						ex = users[0];
						add = users[1];
					}
					else {
						Bot.say(room, `${game.R.name} was subbed with ${cargs[0]}!`);
						game.R.player = users[0];
						game.R.name = cargs[0];
						ex = users[1];
						add = users[0];
					}
				}
				game.spectators.remove(add);
				game.spectators.push(ex);
				runMoves('move', null, game);
				break;
			}
			case 'end': case 'e': {
				if (!Bot.rooms[room].connectfour) return Bot.roomReply(room, by, 'This room does not have any Connect Four games.');
				if (!tools.hasPermission(by, 'gamma', room)) return Bot.roomReply(room, by, 'Access denied.');
				args.shift();
				let id;
				if (!Object.keys(Bot.rooms[room].connectfour).length) return Bot.roomReply(room, by, "No games are active.");
				if (args.length && /^[^a-zA-Z]+$/.test(args.join(''))) id = toID(args.join(''));
				else if (Object.keys(Bot.rooms[room].connectfour).length === 1) id = Object.keys(Bot.rooms[room].connectfour)[0];
				else {
					let cargs = args.join('').split(/(?:,|\s+v(?:er)?s(?:us)?\.?\s+)/).map(toID);
					if (cargs.length !== 2) return Bot.roomReply(room, by, unxa);
					id = Object.keys(Bot.rooms[room].connectfour).find(k => {
						let game = Bot.rooms[room].connectfour[k];
						if (cargs.includes(game.Y.player) && cargs.includes(game.R.player)) return true;
					});
				}
				if (!id) return Bot.roomReply(room, by, "Unable to find the game you're talking about. :(");
				let game = Bot.rooms[room].connectfour[id];
				if (!game) return Bot.roomReply(room, by, "Invalid ID.");
				if (!game.started) Bot.say(room, `/changeuhtml CONNECTFOUR-${id}, Ended. :(`);
				delete Bot.rooms[room].connectfour[id];
				fs.unlink(`./data/BACKUPS/connectfour-${room}-${id}.json`, () => {});
				return Bot.say(room, `Welp, ended Connect Four#${id}.`);
				break;
			}
			case 'backups': case 'stashed': {
				if (!tools.hasPermission(by, 'gamma', room)) return Bot.roomReply(room, by, "Access denied.");
				if (isPM) return Bot.roomReply(room, by, `Please use this in the room. Please. PLEASE`);
				fs.readdir('./data/BACKUPS', (err, files) => {
					if (err) {
						Bot.say(room, err);
						return Bot.log(err);
					}
					let games = files.filter(file => file.startsWith(`connectfour-${room}-`)).map(file => file.slice(0, -4)).map(file => file.replace(/[^0-9]/g, ''));
					if (games.length) {
						Bot.say(room, `/adduhtml CONNECTFOURBACKUPS, <details><summary>Game Backups</summary><hr />${games.map(game => {
							let info = require(`../../data/BACKUPS/connectfour-${room}-${game}.json`);
							return `<button name="send" value="/botmsg ${Bot.status.nickName},${prefix}connectfour ${room} restore ${game}">${info.Y.name} vs ${info.R.name}</button>`;
						}).join('<br />')}</details>`);
					}
					else Bot.say(room, "No backups found.");
				})
				break;
			}
			case 'restore': case 'resume': case 'r': {
				args.shift();
				if (!tools.hasPermission(by, 'gamma', room)) return Bot.roomReply(room, by, "Access denied.");
				let id = parseInt(args.join(''));
				if (!id) return Bot.say(room, "Invalid ID.");
				if (Bot.rooms[room].connectfour?.[id]) return Bot.roomReply(room, by, "Sorry, that game is already in progress!");
				fs.readFile(`./data/BACKUPS/connectfour-${room}-${id}.json`, 'utf8', (err, file) => {
					if (err) return Bot.say(room, "Sorry, couldn't find that game!");
					if (!Bot.rooms[room].connectfour) Bot.rooms[room].connectfour = {};
					Bot.rooms[room].connectfour[id] = GAMES.create('connectfour', id, {}, room, JSON.parse(file));
					Bot.say(room, "Game has been restored!");
					let game = Bot.rooms[room].connectfour[id];
					game.spectators.forEach(spect => Bot.say(room, `/sendhtmlpage ${spect}, Connect Four + ${room} + ${id}, <center><h1>${game[game.turn].name}'s Turn (${game.turn})</h1>${game.boardHTML()}</center>`));
					Bot.say(room, `/sendhtmlpage ${game.Y.player}, Connect Four + ${room} + ${id}, ${game.turn === "Y" ? "<h1 style=\"text-align: center;\">Your turn!</h1>" : "<h1 style=\"text-align: center;\">Waiting for opponent...</h1>"}<center>${game.boardHTML(true)}</center>`);
					Bot.say(room, `/sendhtmlpage ${game.R.player}, Connect Four + ${room} + ${id}, ${game.turn === "R" ? "<h1 style=\"text-align: center;\">Your turn!</h1>" : "<h1 style=\"text-align: center;\">Waiting for opponent...</h1>"}<center>${game.boardHTML(true)}</center>`);
				});
				return;
				break;
			}
			case 'menu': case 'm': case 'list': case 'l': case 'players': {
				let connectfour = Bot.rooms[room].connectfour;
				if (!connectfour || !Object.keys(connectfour).length) {
					if (tools.hasPermission(by, 'gamma', room) && !isPM) return Bot.say(room, "Sorry, no games found.");
					return Bot.roomReply(room, by, "Sorry, no games found.");
				}
				let html = `<hr />${Object.keys(connectfour).map(id => {
					let game = connectfour[id];
					return `${game.Y.name ? tools.colourize(game.Y.name) : `<button name="send" value="/botmsg ${Bot.status.nickName}, ${prefix}connectfour ${room} join ${id} Yellow">Yellow</button>`} vs ${game.R.name ? tools.colourize(game.R.name) : `<button name="send" value="/botmsg ${Bot.status.nickName}, ${prefix}connectfour ${room} join ${id} Red">Red</button>`} ${game.started ? `<button name="send" value ="/msg ${Bot.status.nickName}, ${prefix}connectfour ${room} spectate ${id}">Watch</button> ` : ''}(#${id})`;
				}).join('<br />')}<hr />`;
				let staffHTML = `<hr />${Object.keys(connectfour).map(id => {
					let game = connectfour[id];
					return `${game.Y.name ? tools.colourize(game.Y.name) : `<button name="send" value="/botmsg ${Bot.status.nickName}, ${prefix}connectfour ${room} join ${id} Yellow">Yellow</button>`} vs ${game.R.name ? tools.colourize(game.R.name) : `<button name="send" value="/botmsg ${Bot.status.nickName}, ${prefix}connectfour ${room} join ${id} Red">Red</button>`} ${game.started ? `<button name="send" value ="/msg ${Bot.status.nickName}, ${prefix}connectfour ${room} spectate ${id}">Watch</button> ` : ''}<button name="send" value="/botmsg ${Bot.status.nickName}, ${prefix}connectfour ${room} end ${id}">End</button> <button name="send" value="/botmsg ${Bot.status.nickName}, ${prefix}connectfour ${room} stash ${id}">Stash</button>(#${id})`;
				}).join('<br />')}<hr />`;
				if (isPM === 'export') return [html, staffHTML];
				if (tools.hasPermission(by, 'gamma', room) && !isPM) {
					Bot.say(room, `/adduhtml CONNECTFOURMENU,${html}`);
					Bot.say(room, `/changerankuhtml +, CONNECTFOURMENU, ${staffHTML}`);
				}
				else Bot.say(room, `/sendprivatehtmlbox ${by}, html`);
				break;
			}
			case 'resign': case 'forfeit': case 'f': case 'ff': case 'ihavebeenpwned': case 'bully': {
				if (!Bot.rooms[room].connectfour) return Bot.roomReply(room, by, 'There isn\'t an active Connect Four game in this room.');
				args.shift();
				let id, user = toID(by);
				if (args.length) id = toID(args.join(''));
				else if (Object.keys(Bot.rooms[room].connectfour).length === 1) id = Object.keys(Bot.rooms[room].connectfour)[0];
				else id = Object.keys(Bot.rooms[room].connectfour).find(k => {
					let game = Bot.rooms[room].connectfour[k];
					return game && game.started && [game.Y.player, game.R.player].includes(user);
				});
				if (!id) return Bot.roomReply(room, by, "Unable to find the game you meant to play in.");
				let game = Bot.rooms[room].connectfour[id];
				if (!game) return Bot.roomReply(room, by, "Not a valid ID.");
				if (!game.started) return Bot.roomReply(room, by, '>resigning before it starts');
				if (![game.Y.player, game.R.player].includes(user)) return Bot.roomReply(room, by, "Only a player can resign.");
				const side = game.Y.player === user ? "Y" : "R";
				if (!game[side].isResigning) {
					Bot.roomReply(room, by, 'Are you sure you want to resign? If you are, use this command again.');
					return game[side].isResigning = true;
				}
				runMoves('resign', side, game);
				break;
			}
			case 'spectate': case 's': case 'watch': case 'w': {
				if (!Bot.rooms[room].connectfour) return Bot.roomReply(room, by, 'This room does not have any Connect Four games.');
				args.shift();
				let id;
				if (args.length && /^[^a-zA-Z]+$/.test(args.join(''))) id = toID(args.join(''));
				else if (Object.keys(Bot.rooms[room].connectfour).length === 1) id = Object.keys(Bot.rooms[room].connectfour)[0];
				else if (Object.values(Bot.rooms[room].connectfour).filter(game => game.started).length === 1) id = Object.values(Bot.rooms[room].connectfour).filter(game => game.started)[0].id;
				else {
					let cargs = args.join('').split(/(?:,|\s+v(?:er)?s(?:us)?\.?\s+)/).map(toID);
					if (cargs.length !== 2) return Bot.roomReply(room, by, "Sorry, specify the players again?");
					id = Object.keys(Bot.rooms[room].connectfour).find(k => {
						let game = Bot.rooms[room].connectfour[k];
						if (cargs.includes(game.Y.player) && cargs.includes(game.R.player) && !game.spectators.includes(toID(by))) return true;
					});
				}
				let game = Bot.rooms[room].connectfour[id];
				if (!game) return Bot.roomReply(room, by, "Sorry, no Connect Four game here to spectate.");
				if (!game.started) Bot.roomReply(room, by, "Oki, I'll send you the board when it starts.");
				let user = toID(by);
				if ([game.Y.player, game.R.player].includes(user)) return Bot.roomReply(room, by, "Imagine spectating your own game.");
				if (!game.spectators.includes(user)) game.spectators.push(user);
				Bot.say(room, `/sendhtmlpage ${by}, Connect Four + ${room} + ${id}, <center><h1>${game[game.turn].name}'s Turn (${game.turn})</h1>${game.boardHTML()}</center>`);
				return Bot.roomReply(room, by, `You are now spectating the Connect Four match between ${game.Y.name} and ${game.R.name}!`);
				break;
			}
			case 'unspectate': case 'us': case 'unwatch': case 'uw': case 'zestoflifeisstinky': {
				if (!Bot.rooms[room].connectfour) return Bot.roomReply(room, by, 'This room does not have any Connect Four games.');
				args.shift();
				let id;
				if (args.length && /^[^a-zA-Z]+$/.test(args.join(''))) id = toID(args.join(''));
				else if (Object.values(Bot.rooms[room].connectfour).filter(game => game.spectators.includes(toID(by))).length === 1) id = Object.values(Bot.rooms[room].connectfour).filter(game => game.spectators.includes(toID(by)))[0].id;
				else {
					let cargs = args.join('').split(/(?:,|\s+v(?:er)?s(?:us)?\.?\s+)/).map(toID);
					if (cargs.length !== 2) return Bot.roomReply(room, by, "Sorry, didn't get the game you meant.");
					id = Object.keys(Bot.rooms[room].connectfour).find(k => {
						let game = Bot.rooms[room].connectfour[k];
						if (cargs.includes(game.Y.player) && cargs.includes(game.R.player) && game.spectators.includes(toID(by))) return true;
					});
				}
				let game = Bot.rooms[room].connectfour[id];
				if (!game) return Bot.roomReply(room, by, "Sorry, no Connect Four game here to unspectate.");
				if (!game.started) return Bot.roomReply(room, by, "AYAYAYA - no.");
				let user = toID(by);
				if ([game.Y.player, game.R.player].includes(user)) return Bot.roomReply(room, by, "Imagine unspectating your own game.");
				if (!game.spectators.includes(user)) return Bot.roomReply(room, by, `You aren't spectating! If you want to, use \`\`${prefix}connectfour spectate\`\` instead!`);
				game.spectators.remove(user);
				return Bot.roomReply(room, by, `You are no longer spectating the Connect Four match between ${game.Y.name} and ${game.R.name}.`);
				break;
			}
			case 'rejoin': case 'rj': {
				let games = Bot.rooms[room].connectfour;
				if (!games) return Bot.roomReply(room, by, "Sorry, no Connect Four game here to spectate.");
				let user = toID(by);
				let ids = Object.keys(games).filter(key => [games[key].Y.player, games[key].R.player, ...games[key].spectators].includes(user));
				if (!ids.length) return Bot.roomReply(room, by, "Couldn't find any games for you to rejoin.");
				ids.forEach(id => {
					let game = games[id], side;
					if (game.Y.player === user) side = "Y";
					if (game.R.player === user) side = "R";
					if (!side && !game.spectators.includes(toID(by))) return Bot.roomReply(room, by, `You don't look like a player / spectator - try ${prefix}connectfour spectate ${id}... ;-;`);
					if (game.spectators.includes(user)) Bot.say(room, `/sendhtmlpage ${by}, Connect Four + ${room} + ${id}, <center><h1>${game[game.turn].name}'s Turn (${game.turn})</h1>${game.boardHTML()}</center>`);
					else Bot.say(room, `/sendhtmlpage ${user}, Connect Four + ${room} + ${id}, ${game.turn === side ? "<h1 style=\"text-align: center;\">Your turn!</h1>" : "<h1 style=\"text-align: center;\">Waiting for opponent...</h1>"}<center>${game.boardHTML(true)}</center>`);
				});
				break;
			}
			case 'stash': case 'store': case 'freeze': case 'hold': case 'h': {
				if (!tools.hasPermission(by, 'gamma', room)) return Bot.roomReply(room, by, 'Access denied.');
				if (!Bot.rooms[room].connectfour) return Bot.roomReply(room, by, 'This room does not have any Connect Four games.');
				args.shift();
				let id;
				if (!Object.keys(Bot.rooms[room].connectfour).length) return Bot.roomReply(room, by, "No games are active.");
				if (args.length && /^[^a-zA-Z]+$/.test(args.join(''))) id = toID(args.join(''));
				else if (Object.keys(Bot.rooms[room].connectfour).length === 1) id = Object.keys(Bot.rooms[room].connectfour)[0];
				else {
					let cargs = args.join('').split(/(?:,|\s+v(?:er)?s(?:us)?\.?\s+)/).map(toID);
					if (cargs.length !== 2) return Bot.roomReply(room, by, unxa);
					id = Object.keys(Bot.rooms[room].connectfour).find(k => {
						let game = Bot.rooms[room].connectfour[k];
						if (cargs.includes(game.Y.player) && cargs.includes(game.R.player)) return true;
					});
				}
				if (!id) return Bot.roomReply(room, by, "Unable to find the game you're talking about. :(");
				let game = Bot.rooms[room].connectfour[id];
				if (!game) return Bot.roomReply(room, by, "Invalid ID.");
				Bot.say(room, `The Connect Four match between ${game.Y.name || '(no one)'} and ${game.R.name || '(no one)'} has been put on hold!`);
				delete Bot.rooms[room].connectfour[id];
				break;
			}
			default: {
				Bot.roomReply(room, by, `That, uhh, doesn't seem to be something I recognize?`);
				break;
			}
		}
	}
}