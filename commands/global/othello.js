function sendEmbed (room, winner, players, board, logs, scores) {
	Bot.say(room, `http://partbot.partman.co.in/othello/${logs}`);
	if (!['boardgames'].includes(room)) return;
	let Embed = require('discord.js').MessageEmbed, embed = new Embed();
	embed.setColor('#008000').setAuthor('Othello - Room Match').setTitle((winner === 'W' ? `**${players.W}**` : players.W) + ' vs ' + (winner === 'B' ? `**${players.B}**` : players.B)).setURL(`http://partbot.partman.co.in/othello/${logs}`).addField(scores ? scores.join(' - ') : '\u200b', Object.values(board).map(row => row.map(cell => {
		switch (cell) {
			case 'B': {
				return ':black_circle:';
				break;
			}
			case 'W': {
				return ':white_circle:';
				break;
			}
			default: return ':green_circle:';
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
		case 'start': {
			game.start();
			Bot.say(room, `Othello: ${game.W.name} vs ${game.B.name} GOGO`);
			game.spectatorSend(`<center><h1>${game[game.turn].name}'s Turn (${game.turn})</h1>${game.boardHTML()}</center>`).then(() => {
				Bot.say(room, `/sendhtmlpage ${game.W.player}, Othello + ${room} + ${id}, ${game.turn === "W" ? "<h1 style=\"text-align: center;\">Your turn!</h1>" : "<h1 style=\"text-align: center;\">Waiting for opponent...</h1>"}<center>${game.boardHTML(true)}</center>`);
				Bot.say(room, `/sendhtmlpage ${game.B.player}, Othello + ${room} + ${id}, ${game.turn === "B" ? "<h1 style=\"text-align: center;\">Your turn!</h1>" : "<h1 style=\"text-align: center;\">Waiting for opponent...</h1>"}<center>${game.boardHTML(true)}</center>`);
				setTimeout(() => {
					Bot.say(room, `/highlighthtmlpage ${game.W.player}, Othello + ${room} + ${id}, Your turn!`);
				}, 1000);
				Bot.say(room, `/adduhtml OTHELLO-${id},<hr />${tools.colourize(game.W.name)} vs ${tools.colourize(game.B.name)}! <div style="text-align: right; display: inline-block; font-size: 0.9em; float: right;"><button name="send" value="/msg ${Bot.status.nickName}, ${prefix}othello ${room} spectate ${id}">Watch!</button></div><hr />`);
			});
			return;
			break;
		}
		case 'join': {
			let {user, side} = info;
			game[side].player = toId(user);
			game[side].name = user.replace(/[<>]/g, '');
			if (game.W.player && game.B.player) return runMoves('start', null, game);
			let html = `<hr /><h1>Othello Signups are active!</h1>${["W", "B"].filter(side => !game[side].player).map(side => `<button name="send" value="/msg ${Bot.status.nickName}, ${prefix}othello ${room}, join ${id} ${side === 'W' ? 'White' : 'Black'}">${side === 'W' ? 'White' : 'Black'}</button>`).join('&nbsp;')}<hr />`;
			return Bot.say(room, `/adduhtml OTHELLO-${id}, ${html}`);
			break;
		}
		case 'W': case 'B': {
			game.spectatorSend(`<center><h1>${game[game.turn].name}'s Turn (${game.turn})</h1>${game.boardHTML()}</center>`);
			Bot.say(room, `/sendhtmlpage ${game.W.player}, Othello + ${room} + ${id}, ${game.turn === "W" ? "<h1 style=\"text-align: center;\">Your turn!</h1>" : "<h1 style=\"text-align: center;\">Waiting for opponent...</h1>"}<center>${game.boardHTML(true)}</center>`);
			Bot.say(room, `/sendhtmlpage ${game.B.player}, Othello + ${room} + ${id}, ${game.turn === "B" ? "<h1 style=\"text-align: center;\">Your turn!</h1>" : "<h1 style=\"text-align: center;\">Waiting for opponent...</h1>"}<center>${game.boardHTML(true)}</center>`);
			setTimeout(() => {
				Bot.say(room, `/highlighthtmlpage ${game[game.turn].player}, Othello + ${room} + ${id}, Your turn!`);
			}, 1000);
			break;
		}
		case 'resign': {
			let loser = info, players = {W: game.W.name, B: game.B.name}, board = game.board, logs = game.moves, winner = loser === 'W' ? 'B' : 'W';
			fs.unlink(`./data/BACKUPS/othello-${room}-${id}.json`, e => {});
			Bot.say(room, `/adduhtml OTHELLO-${Date.now()},<center>${game.boardHTML()}</center>`);
			game.spectatorSend(`<center><h1>Resigned.</h1>${game.boardHTML()}</center>`);
			Bot.say(room, `/sendhtmlpage ${game.W.player}, Othello + ${room} + ${id}, <center><h1>Resigned.</h1>${game.boardHTML(true)}</center>`);
			Bot.say(room, `/sendhtmlpage ${game.B.player}, Othello + ${room} + ${id}, <center><h1>Resigned.</h1>${game.boardHTML(true)}</center>`);
			Bot.say(room, `${players[loser]} resigned.`);
			logs += (winner === 'W' ? 'Y' : 'Z');
			delete Bot.rooms[room].othello[id];
			sendEmbed(room, winner, players, board, logs);
			return;
			break;
		}
		default: {
			let info = JSON.parse(run);
			let winner = info.winner, players = {W: game.W.name, B: game.B.name}, board = game.board, logs = game.moves;
			fs.unlink(`./data/BACKUPS/othello-${room}-${id}.json`, e => {});
			Bot.say(room, `/adduhtml OTHELLO-${Date.now()},<center>${game.boardHTML(false, true)}</center>`);
			game.spectatorSend(`<center><h1>Game Ended.</h1>${game.boardHTML()}</center>`);
			Bot.say(room, `/sendhtmlpage ${game.W.player}, Othello + ${room} + ${id}, <center><h1>Game Ended.</h1>${game.boardHTML('W', true)}</center>`);
			Bot.say(room, `/sendhtmlpage ${game.B.player}, Othello + ${room} + ${id}, <center><h1>Game Ended.</h1>${game.boardHTML('B', true)}</center>`);
			let wScore, bScore;
			Bot.say(room, `Game ended! ${game[winner] ? `${game[winner].name} won!` : 'It was a draw!'} ${wScore = board.reduce((accu, row) => accu + row.reduce((acc, cur) => cur === 'W' ? acc + 1 : acc, 0), 0)}W/${bScore = board.reduce((accu, row) => accu + row.reduce((acc, cur) => cur === 'B' ? acc + 1 : acc, 0), 0)}B`);
			delete Bot.rooms[room].othello[id];
			sendEmbed(room, winner, players, board, logs, [wScore, bScore]);
			return;
			break;
		}
	}
	fs.writeFile(`./data/BACKUPS/othello-${room}-${id}.json`, JSON.stringify(game), e => {
		if (e) console.log(e);
	});
}

module.exports = {
	cooldown: 1,
	help: `The Othello module. Use \`\`${prefix}othello new\`\` to make a game, and \`\`${prefix}othello spectate\`\` to watch. To resign, use \`\`${prefix}othello resign\`\`. Rules: https://www.worldothello.org/about/about-othello/othello-rules/official-rules/english`,
	permissions: 'none',
	commandFunction: function (Bot, room, time, by, args, client, isPM) {
		if (!args[0]) args.push('help');
		switch (args[0].toLowerCase()) {
			case 'help': case 'h': {
				if (tools.hasPermission(by, 'gamma', room) && !isPM) return Bot.say(room, this.help);
				else Bot.pm(by, this.help);
				break;
			}
			case 'new': case 'n': {
				if (!tools.hasPermission(by, 'gamma', room)) return Bot.pm(by, 'Access denied.');
				if (isPM) return Bot.pm(by, `Thou art stinky, do this in a chatroom`);
				if (!tools.canHTML(room)) return Bot.say(room, 'I can\'t do that here. Ask an RO to promote me or something.');
				if (!Bot.rooms[room].othello) Bot.rooms[room].othello = {};
				const id = Date.now();
				Bot.rooms[room].othello[id] = GAMES.create('othello', id, room);
				Bot.say(room, `/adduhtml OTHELLO-${id}, <HR><h1>Othello Signups have begun!</h1><button name="send" value="/msg ${Bot.status.nickName}, ${prefix}othello ${room}, join ${id} White">White</button><button name="send" value="/msg ${Bot.status.nickName}, ${prefix}othello ${room}, join ${id} Black">Black</button><HR>`);
				Bot.say(room, '/notifyrank all, Othello, A new game of Othello has been created!, A new game of Othello has been created.');
				return;
				break;
			}
			case 'join': case 'j': {
				if (!Bot.rooms[room].othello) return Bot.pm(by, 'There isn\'t an active Othello game in this room.');
				if (!args[1]) return Bot.pm(by, 'Please specify the ID / side.');
				let id, side, user = toId(by);
				if (args[2] && parseInt(args[1])) {
					id = args[1];
					side = args[2][0].toUpperCase();
					if (!["W", "B"].includes(side)) return Bot.pm(by, "I only accept white and black. (insert snarky comment)");
				}
				else if (Object.keys(Bot.rooms[room].othello).length === 1) {
					id = Object.keys(Bot.rooms[room].othello)[0];
					side = args[1][0].toUpperCase();
				}
				else {
					side = args[1][0].toUpperCase();
					if (!["W", "B"].includes(side)) return Bot.pm(by, "I only accept white and black. (insert snarky comment)");
					id = Object.keys(Bot.rooms[room].othello).find(k => {
						let game = Bot.rooms[room].othello[k];
						return game && !game.started && !game[side].player;
					});
					if (!id) return Bot.pm(by, "Sorry, unable to find any open games.");
				}
				let game = Bot.rooms[room].othello[id];
				if (!game) return Bot.pm(by, "Nope. BOOP");
				if (game.started) return Bot.pm(by, 'Too late!');
				if (game[side].player) return Bot.pm(by, "Sorry, already taken!");
				const other = side === 'W' ? 'B' : 'W';
				if (game[other].player === user) return Bot.pm(by, "~~You couldn't find anyone else to fight you? __Really__?~~");
				Bot.say(room, `${by.substr(1)} joined Othello (#${id}) as ${side === 'W' ? 'White' : 'Black'}!`);
				runMoves('join', {user: by.substr(1), side: side}, game);
				break;
			}
			case 'play': case 'move': case 'click': {
				if (!Bot.rooms[room].othello) return Bot.pm(by, 'There isn\'t an active Othello game in this room.');
				if (!args[1]) return Bot.pm(by, unxa);
				args.shift();
				if (!Object.keys(Bot.rooms[room].othello).length) return Bot.pm(by, "No games are active.");
				let id, user = toId(by);
				console.log(args[0]);
				if (args[0] && /^\d+$/.test(args[0].trim())) id = args.shift().trim();
				else id = Object.keys(Bot.rooms[room].othello).find(k => {
					let game = Bot.rooms[room].othello[k];
					return game && game.started && !game[game.turn].player === user;
				});
				if (!id) return Bot.pm(by, "Unable to find the game you meant to play in.");
				let game = Bot.rooms[room].othello[id];
				if (!game) return Bot.pm(by, "Not a valid ID.");
				if (!game.started) return Bot.pm(by, 'OI, IT HASN\'T STARTED!');
				if (!(game[game.turn].player === toId(by))) return;
				let coords = args.join('').split(',');
				if (coords.length !== 2) return Bot.pm(by, "I need two coordinates to play - why not click on the board instead?");
				coords = coords.map(t => parseInt(toId(t)));
				if (isNaN(coords[0]) || isNaN(coords[1])) return Bot.pm(by, "Invalid coordinates. ;-;");
				let canPlay = game.canPlay(...coords);
				if (!canPlay) return Bot.pm(by, "Sorry, you can't play there!");
				delete game.W.isResigning;
				delete game.B.isResigning;
				game.play(coords[0], coords[1]);
				runMoves(game.nextTurn(), null, game);
				break;
			}
			case 'substitute': case 'sub': {
				if (!tools.hasPermission(by, 'gamma', room)) return Bot.pm(by, 'Access denied.');
				if (!Bot.rooms[room].othello) return Bot.pm(by, 'This room does not have any Othello games.');
				args.shift();
				let id, cargs;
				if (!Object.keys(Bot.rooms[room].othello).length) return Bot.pm(by, "No games are active.");
				if (/^[^a-zA-Z]+$/.test(args[0])) id = toId(args.shift());
				else if (Object.keys(Bot.rooms[room].othello).length === 1) id = Object.keys(Bot.rooms[room].othello)[0];
				else {
					cargs = args.join(' ').split(/\s*,\s*/);
					if (cargs.length !== 2) return Bot.pm(by, "I NEED TWO NAMES GIVE ME TWO NAMES");
					let id1 = toId(cargs[0]), id2 = toId(cargs[1]);
					id = Object.keys(Bot.rooms[room].othello).find(k => {
						let game = Bot.rooms[room].othello[k], ps = [game.W.player, game.B.player];
						return game && game.started && ((ps.includes(id1) && !ps.includes(id2)) || (!ps.includes(id1) && ps.includes(id2)));
					});
				}
				cargs = args.join(' ').replace(/[<>]/g, '').split(/\s*,\s*/);
				if (cargs.length !== 2) return Bot.pm(by, "I NEED TWO NAMES GIVE ME TWO NAMES");
				if (!id) return Bot.pm(by, "Sorry, I couldn't find a valid game to sub.");
				let game = Bot.rooms[room].othello[id];
				if (!game.started) return Bot.pm(by, 'Excuse me?');
				cargs = cargs.map(carg => carg.trim());
				let users = cargs.map(carg => toId(carg));
				if ((users.includes(game.W.player) && users.includes(game.B.player)) || (!users.includes(game.W.player) && !users.includes(game.B.player))) return Bot.say(room, 'Those users? Something\'s wrong with those...');
				if ([game.W.player, game.B.player].includes(toId(by)) && !tools.hasPermission(by, 'coder')) return Bot.say(room, "Hah! Can't sub yourself out.");
				if (users.includes(game.W.player)) {
					if (users[0] == game.W.player) {
						Bot.say(room, `${game.W.name} was subbed with ${cargs[1]}!`);
						game.W.player = users[1];
						game.W.name = cargs[1];
						ex = users[0];
						add = users[1];
					}
					else {
						Bot.say(room, `${game.W.name} was subbed with ${cargs[0]}!`);
						game.W.player = users[0];
						game.W.name = cargs[0];
						ex = users[1];
						add = users[0];
					}
				}
				else {
					if (users[0] == game.B.player) {
						Bot.say(room, `${game.B.name} was subbed with ${cargs[1]}!`);
						game.B.player = users[1];
						game.B.name = cargs[1];
						ex = users[0];
						add = users[1];
					}
					else {
						Bot.say(room, `${game.B.name} was subbed with ${cargs[0]}!`);
						game.B.player = users[0];
						game.B.name = cargs[0];
						ex = users[1];
						add = users[0];
					}
				}
				game.spectators.remove(add);
				game.spectators.push(ex);
				runMoves(game.turn, null, game);
				break;
			}
			case 'end': case 'e': {
				if (!Bot.rooms[room].othello) return Bot.pm(by, 'This room does not have any Othello games.');
				if (!tools.hasPermission(by, 'gamma', room)) return Bot.pm(by, 'Access denied.');
				args.shift();
				let id;
				if (!Object.keys(Bot.rooms[room].othello).length) return Bot.pm(by, "No games are active.");
				if (args.length && /^[^a-zA-Z]+$/.test(args.join(''))) id = toId(args.join(''));
				else if (Object.keys(Bot.rooms[room].othello).length === 1) id = Object.keys(Bot.rooms[room].othello)[0];
				else {
					let cargs = args.join('').split(/(?:,|\s+v(?:er)?s(?:us)?\.?\s+)/).map(toId);
					if (cargs.length !== 2) return Bot.pm(by, unxa);
					id = Object.keys(Bot.rooms[room].othello).find(k => {
						let game = Bot.rooms[room].othello[k];
						if (cargs.includes(game.W.player) && cargs.includes(game.B.player)) return true;
					});
				}
				if (!id) return Bot.pm(by, "Unable to find the game you're talking about. :(");
				let game = Bot.rooms[room].othello[id];
				if (!game) return Bot.pm(by, "Invalid ID.");
				if (!game.started) Bot.say(room, `/changeuhtml OTHELLO-${id}, Ended. :(`);
				delete Bot.rooms[room].othello[id];
				fs.unlink(`./data/BACKUPS/othello-${room}-${id}.json`, () => {});
				return Bot.say(room, `Welp, ended Othello#${id}.`);
				break;
			}
			case 'backups': {
				if (!tools.hasPermission(by, 'gamma', room)) return Bot.pm(by, "Access denied.");
				if (isPM) return Bot.pm(by, `Please use this in the room. Please. PLEASE`);
				fs.readdir('./data/BACKUPS', (err, files) => {
					if (err) {
						Bot.say(room, err);
						return Bot.log(err);
					}
					let games = files.filter(file => file.startsWith(`othello-${room}-`)).map(file => file.slice(0, -4)).map(file => file.replace(/[^0-9]/g, ''));
					if (games.length) {
						Bot.say(room, `/adduhtml OTHELLOBACKUPS, <details><summary>Game Backups</summary><hr />${games.map(game => {
							let info = require(`../../data/BACKUPS/othello-${room}-${game}.json`);
							return `<button name="send" value="/msg ${Bot.status.nickName},${prefix}othello ${room} restore ${game}">${info.W.name} vs ${info.B.name}</button>`;
						}).join('<br />')}</details>`);
					}
					else Bot.say(room, "No backups found.");
				})
				break;
			}
			case 'restore': case 'resume': case 'r': {
				args.shift();
				if (!tools.hasPermission(by, 'gamma', room)) return Bot.pm(by, "Access denied.");
				let id = parseInt(args.join(''));
				if (!id) return Bot.say(room, "Invalid ID.");
				if (Bot.rooms[room].othello?.[id]) return Bot.pm(by, "Sorry, that game is already in progress!");
				fs.readFile(`./data/BACKUPS/othello-${room}-${id}.json`, 'utf8', (err, file) => {
					if (err) return Bot.say(room, "Sorry, couldn't find that game!");
					if (!Bot.rooms[room].othello) Bot.rooms[room].othello = {};
					Bot.rooms[room].othello[id] = GAMES.create('othello', id, room, JSON.parse(file));
					Bot.say(room, "Game has been restored!");
					let game = Bot.rooms[room].othello[id];
					game.spectatorSend(`<center><h1>${game[game.turn].name}'s Turn (${game.turn})</h1>${game.boardHTML()}</center>`);
					Bot.say(room, `/sendhtmlpage ${game.W.player}, Othello + ${room} + ${id}, ${game.turn === "W" ? "<h1 style=\"text-align: center;\">Your turn!</h1>" : "<h1 style=\"text-align: center;\">Waiting for opponent...</h1>"}<center>${game.boardHTML(true)}</center>`);
					Bot.say(room, `/sendhtmlpage ${game.B.player}, Othello + ${room} + ${id}, ${game.turn === "B" ? "<h1 style=\"text-align: center;\">Your turn!</h1>" : "<h1 style=\"text-align: center;\">Waiting for opponent...</h1>"}<center>${game.boardHTML(true)}</center>`);
				});
				return;
				break;
			}
			case 'menu': case 'm': case 'list': case 'l': case 'players': {
				let othello = Bot.rooms[room].othello;
				if (!othello || !Object.keys(othello).length) {
					if (tools.hasPermission(by, 'gamma', room) && !isPM) return Bot.say(room, "Sorry, no games found.");
					return Bot.pm(by, "Sorry, no games found.");
				}
				let html = `<hr />${Object.keys(othello).map(id => {
					let game = othello[id];
					return `${game.W.name ? tools.colourize(game.W.name) : `<button name="send" value="/msg ${Bot.status.nickName}, ${prefix}othello ${room} join ${id} White">White</button>`} vs ${game.B.name ? tools.colourize(game.B.name) : `<button name="send" value="/msg ${Bot.status.nickName}, ${prefix}othello ${room} join ${id} Black">Black</button>`} ${game.started ? `<button name="send" value ="/msg ${Bot.status.nickName}, ${prefix}othello ${room} spectate ${id}">Watch</button> ` : ''}(#${id})`;
				}).join('<br />')}<hr />`;
				let staffHTML = `<hr />${Object.keys(othello).map(id => {
					let game = othello[id];
					return `${game.W.name ? tools.colourize(game.W.name) : `<button name="send" value="/msg ${Bot.status.nickName}, ${prefix}othello join ${id} White">White</button>`} vs ${game.B.name ? tools.colourize(game.B.name) : `<button name="send" value="/msg ${Bot.status.nickName}, ${prefix}othello ${room} join ${id} Black">Black</button>`} ${game.started ? `<button name="send" value ="/msg ${Bot.status.nickName}, ${prefix}othello ${room} spectate ${id}">Watch</button> ` : ''}${tools.hasPermission(by, 'gamma', room) ? `<button name="send" value="/msg ${Bot.status.nickName}, ${prefix}othello ${room} end ${id}">End</button> <button name="send" value="/msg ${Bot.status.nickName}, ${prefix}othello ${room} stash ${id}">Stash</button>` : ''}(#${id})`;
				}).join('<br />')}<hr />`;
				if (tools.hasPermission(by, 'gamma', room)) {
					Bot.say(room, `/adduhtml OTHELLOMENU,${html}`);
					Bot.say(room, `/changerankuhtml +, OTHELLOMENU, ${staffHTML}`);
				}
				else Bot.sendHTML(by, html);
				break;
			}
			case 'resign': case 'forfeit': case 'f': case 'ff': case 'ihavebeenpwned': case 'bully': {
				if (!Bot.rooms[room].othello) return Bot.pm(by, 'There isn\'t an active Othello game in this room.');
				args.shift();
				let id, user = toId(by);
				if (args.length) id = toId(args.join(''));
				else if (Object.keys(Bot.rooms[room].othello).length === 1) id = Object.keys(Bot.rooms[room].othello)[0];
				else id = Object.keys(Bot.rooms[room].othello).find(k => {
					let game = Bot.rooms[room].othello[k];
					return game && game.started && [game.W.player, game.B.player].includes(user);
				});
				if (!id) return Bot.pm(by, "Unable to find the game you meant to play in.");
				let game = Bot.rooms[room].othello[id];
				if (!game) return Bot.pm(by, "Not a valid ID.");
				if (!game.started) return Bot.pm(by, '>resigning before it starts');
				if (![game.W.player, game.B.player].includes(user)) return Bot.pm(by, "Only a player can resign.");
				const side = game.W.player === user ? "W" : "B";
				if (!game[side].isResigning) {
					Bot.pm(by, 'Are you sure you want to resign? If you are, use this command again.');
					return game[side].isResigning = true;
				}
				runMoves('resign', side, game);
				break;
			}
			case 'spectate': case 's': case 'watch': case 'w': {
				if (!Bot.rooms[room].othello) return Bot.pm(by, 'This room does not have any Othello games.');
				args.shift();
				let id;
				if (args.length && /^[^a-zA-Z]+$/.test(args.join(''))) id = toId(args.join(''));
				else if (Object.keys(Bot.rooms[room].othello).length === 1) id = Object.keys(Bot.rooms[room].othello)[0];
				else if (Object.values(Bot.rooms[room].othello).filter(game => game.started).length === 1) id = Object.values(Bot.rooms[room].othello).filter(game => game.started)[0].id;
				else {
					let cargs = args.join('').split(/(?:,|\s+v(?:er)?s(?:us)?\.?\s+)/).map(toId);
					if (cargs.length !== 2) return Bot.pm(by, "Sorry, specify the players again?");
					id = Object.keys(Bot.rooms[room].othello).find(k => {
						let game = Bot.rooms[room].othello[k];
						if (cargs.includes(game.W.player) && cargs.includes(game.B.player) && !game.spectators.includes(toId(by))) return true;
					});
				}
				let game = Bot.rooms[room].othello[id];
				if (!game) return Bot.pm(by, "Sorry, no Othello game here to spectate.");
				if (!game.started) Bot.pm(by, "Oki, I'll send you the board when it starts.");
				let user = toId(by);
				if ([game.W.player, game.B.player].includes(user)) return Bot.pm(by, "Imagine spectating your own game.");
				if (!game.spectators.includes(user)) game.spectators.push(user);
				Bot.say(room, `/sendhtmlpage ${by}, Othello + ${room} + ${id}, <center><h1>${game[game.turn].name}'s Turn (${game.turn})</h1>${game.boardHTML()}</center>`);
				return Bot.pm(by, `You are now spectating the Othello match between ${game.W.name} and ${game.B.name}!`);
				break;
			}
			case 'unspectate': case 'us': case 'unwatch': case 'uw': case 'zestoflifeisstinky': {
				if (!Bot.rooms[room].othello) return Bot.pm(by, 'This room does not have any Othello games.');
				args.shift();
				let id;
				if (args.length && /^[^a-zA-Z]+$/.test(args.join(''))) id = toId(args.join(''));
				else if (Object.values(Bot.rooms[room].othello).filter(game => game.spectators.includes(toId(by))).length === 1) id = Object.values(Bot.rooms[room].othello).filter(game => game.spectators.includes(toId(by)))[0].id;
				else {
					let cargs = args.join('').split(/(?:,|\s+v(?:er)?s(?:us)?\.?\s+)/).map(toId);
					if (cargs.length !== 2) return Bot.pm(by, "Sorry, didn't get the game you meant.");
					id = Object.keys(Bot.rooms[room].othello).find(k => {
						let game = Bot.rooms[room].othello[k];
						if (cargs.includes(game.W.player) && cargs.includes(game.B.player) && game.spectators.includes(toId(by))) return true;
					});
				}
				let game = Bot.rooms[room].othello[id];
				if (!game) return Bot.pm(by, "Sorry, no Othello game here to unspectate.");
				if (!game.started) return Bot.pm(by, "AYAYAYA - no.");
				let user = toId(by);
				if ([game.W.player, game.B.player].includes(user)) return Bot.pm(by, "Imagine unspectating your own game.");
				if (!game.spectators.includes(user)) return Bot.pm(by, `You aren't spectating! If you want to, use \`\`${prefix}othello spectate\`\` instead!`);
				game.spectators.remove(user);
				return Bot.pm(by, `You are no longer spectating the Othello match between ${game.W.name} and ${game.B.name}.`);
				break;
			}
			case 'rejoin': case 'rj': {
				let games = Bot.rooms[room].othello;
				if (!games) return Bot.pm(by, "Sorry, no Othello game here to spectate.");
				let user = toId(by);
				let ids = Object.keys(games).filter(key => [games[key].W.player, games[key].B.player, ...games[key].spectators].includes(user));
				if (!ids.length) return Bot.pm(by, "Couldn't find any games for you to rejoin.");
				ids.forEach(id => {
					let game = games[id], side;
					if (game.W.player === user) side = "W";
					if (game.B.player === user) side = "B";
					if (!side && !game.spectators.includes(toId(by))) return Bot.pm(by, `You don't look like a player / spectator - try ${prefix}othello spectate ${id}... ;-;`);
					if (game.spectators.includes(user)) Bot.say(room, `/sendhtmlpage ${by}, Othello + ${room} + ${id}, <center><h1>${game[game.turn].name}'s Turn (${game.turn})</h1>${game.boardHTML()}</center>`);
					else Bot.say(room, `/sendhtmlpage ${user}, Othello + ${room} + ${id}, ${game.turn === side ? "<h1 style=\"text-align: center;\">Your turn!</h1>" : "<h1 style=\"text-align: center;\">Waiting for opponent...</h1>"}<center>${game.boardHTML(true)}</center>`);
				});
				break;
			}
			case 'stash': case 'store': case 'freeze': case 'hold': case 'h': {
				if (!tools.hasPermission(by, 'gamma', room)) return Bot.pm(by, 'Access denied.');
				if (!Bot.rooms[room].othello) return Bot.pm(by, 'This room does not have any Othello games.');
				args.shift();
				let id;
				if (!Object.keys(Bot.rooms[room].othello).length) return Bot.pm(by, "No games are active.");
				if (args.length && /^[^a-zA-Z]+$/.test(args.join(''))) id = toId(args.join(''));
				else if (Object.keys(Bot.rooms[room].othello).length === 1) id = Object.keys(Bot.rooms[room].othello)[0];
				else {
					let cargs = args.join('').split(/(?:,|\s+v(?:er)?s(?:us)?\.?\s+)/).map(toId);
					if (cargs.length !== 2) return Bot.pm(by, unxa);
					id = Object.keys(Bot.rooms[room].othello).find(k => {
						let game = Bot.rooms[room].othello[k];
						if (cargs.includes(game.W.player) && cargs.includes(game.B.player)) return true;
					});
				}
				if (!id) return Bot.pm(by, "Unable to find the game you're talking about. :(");
				let game = Bot.rooms[room].othello[id];
				if (!game) return Bot.pm(by, "Invalid ID.");
				Bot.say(room, `The Othello match between ${game.W.name} and ${game.B.name} has been put on hold!`);
				delete Bot.rooms[room].othello[id];
				break;
			}
			default: {
				Bot.pm(by, `That, uhh, doesn't seem to be something I recognize?`);
				break;
			}
		}
	}
}