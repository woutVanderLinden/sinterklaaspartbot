function sendEmbed (room, W, B, pgn) {
	tools.uploadToLichess(pgn, url => {
		if (!url) return tools.uploadToPastie(pgn, u => Bot.say(room, `Err, couldn't upload to Lichess; take ${u} instead.`));
		Bot.say(room, url);
		if (!['boardgames'].includes(room)) return;
		let Embed = require('discord.js').MessageEmbed, embed = new Embed();
		embed.setColor('#9C5624').setAuthor("Chess - Room Match", "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Chess_tile_kl.svg/1200px-Chess_tile_kl.svg.png").setTitle(`${W} vs ${B}`).setURL(url);
		client.channels.cache.get("576488243126599700").send(embed).catch(e => {
			Bot.say(room, 'Unable to send ' + url + ' to the Discord because ' + e.message);
			Bot.log(e);
		});
	});
}

function runMoves (run, info, game) {
	const room = game.room, id = game.id;
	switch (run) {
		case 'start': {
			game.started = true;
			game.setBoard();
			Bot.say(room, `Chess: ${game.W.name} vs ${game.B.name} GOGO`);
			game.spectatorSend(`<center><h1>${game[game.turn].name}'s Turn (${game.turn})</h1>${game.boardHTML()}</center>`);
			Bot.say(room, `/sendhtmlpage ${game.W.player}, Chess + ${room} + ${id}, ${game.turn === "W" ? "<h1 style=\"text-align: center;\">Your turn!</h1>" : "<h1 style=\"text-align: center;\">Waiting for opponent...</h1>"}<center>${game.boardHTML('W')}</center>`);
			Bot.say(room, `/sendhtmlpage ${game.B.player}, Chess + ${room} + ${id}, ${game.turn === "B" ? "<h1 style=\"text-align: center;\">Your turn!</h1>" : "<h1 style=\"text-align: center;\">Waiting for opponent...</h1>"}<center>${game.boardHTML('B')}</center>`);
			Bot.say(room, `/adduhtml CHESS-${id},<hr />${tools.colourize(game.W.name)} vs ${tools.colourize(game.B.name)}! <div style="text-align: right; display: inline-block; font-size: 0.9em; float: right;"><button name="send" value="/msg ${Bot.status.nickName}, ${prefix}chess ${room} spectate ${id}">Watch!</button></div><hr />`);
			return;
			break;
		}
		case 'join': {
			let {user, side} = info;
			game[side].player = toId(user);
			game[side].name = user.replace(/[<>]/g, '');
			if (game.W.player && game.B.player) return runMoves('start', null, game);
			let html = `<hr /><h1>Chess Signups are active!</h1>${["W", "B"].filter(side => !game[side].player).map(side => `<button name="send" value="/msg ${Bot.status.nickName}, ${prefix}chess ${room}, join ${id} ${side === 'W' ? 'White' : 'Black'}">${side === 'W' ? 'White' : 'Black'}</button>`).join('&nbsp;')}<hr />`;
			return Bot.say(room, `/adduhtml CHESS-${id}, ${html}`);
			break;
		}
		case 1: {
			game.spectatorSend(`<center><h1>${game[game.turn].name}'s Turn (${game.turn})</h1>${game.boardHTML()}</center>`);
			Bot.say(room, `/sendhtmlpage ${game.W.player}, Chess + ${room} + ${id}, ${game.turn === "W" ? "<h1 style=\"text-align: center;\">Your turn!</h1>" : "<h1 style=\"text-align: center;\">Waiting for opponent...</h1>"}<center>${game.boardHTML('W')}</center>`);
			Bot.say(room, `/sendhtmlpage ${game.B.player}, Chess + ${room} + ${id}, ${game.turn === "B" ? "<h1 style=\"text-align: center;\">Your turn!</h1>" : "<h1 style=\"text-align: center;\">Waiting for opponent...</h1>"}<center>${game.boardHTML('B')}</center>`);
			if (game[game.turn].preMove.length) setTimeout(module.exports.commandFunction, 100, Bot, game.room, null, ' ' + game[game.turn].name, ['play', String(game.id), game[game.turn].preMove.join('-')], client);
			break;
		}
		case 2: {
			Bot.say(room, `/sendhtmlpage ${game[game.turn].player}, Chess + ${room} + ${id}, <center><h1 style="text-align: center;">Promotion Time!</h1>${game.boardHTML(game.turn)}</center><br /><center><br /><button name="send" value="/msg ${Bot.status.nickName}, ${prefix}chess ${room} promote ${id} ${info} Queen">Queen</button> <button name="send" value="/msg ${Bot.status.nickName}, ${prefix}chess ${room} promote ${id} ${info} Rook">Rook</button> <button name="send" value="/msg ${Bot.status.nickName}, ${prefix}chess ${room} promote ${id} ${info} Bishop">Bishop</button> <button name="send" value="/msg ${Bot.status.nickName}, ${prefix}chess ${room} promote ${id} ${info} Knight">Knight</button></center>`);
			break;
		}
		case 3: {
			let moves = Array.from(game.moves);
			game.result = (game.turn == 'B' ? '1-0' : '0-1');
			if (!moves) moves = [];
			let W = game.W.name, B = game.B.name, pgn = tools.toPGN(game);
			fs.unlink(`./data/BACKUPS/chess-${room}-${id}.json`, e => {});
			game.switchSides();
			Bot.say(room, `/adduhtml CHESS-${Date.now()},<center>${game.boardHTML(game.turn)}</center>`);
			game.spectatorSend(`<center><h1>Checkmate!</h1>${game.boardHTML()}</center>`);
			Bot.say(room, `/sendhtmlpage ${game.W.player}, Chess + ${room} + ${id}, <center><h1>Checkmate!</h1>${game.boardHTML('W')}</center>`);
			Bot.say(room, `/sendhtmlpage ${game.B.player}, Chess + ${room} + ${id}, <center><h1>Checkmate!</h1>${game.boardHTML('B')}</center>`);
			Bot.say(room, 'Checkmate! Game ended!');
			delete Bot.rooms[room].chess[id];
			sendEmbed(room, W, B, pgn);
			return;
			break;
		}
		case 4: {
			let moves = Array.from(game.moves);
			game.result = '1/2-1/2';
			if (!moves) moves = [];
			moves.push('END');
			let W = game.W.name, B = game.B.name, pgn = tools.toPGN(game);
			fs.unlink(`./data/BACKUPS/chess-${room}-${id}.json`, e => {});
			Bot.say(room, `/adduhtml CHESS-${Date.now()},<center>${game.boardHTML(game.turn)}</center>`);
			game.spectatorSend(`<center><h1>Stalemate</h1>${game.boardHTML()}</center>`);
			Bot.say(room, `/sendhtmlpage ${game.W.player}, Chess + ${room} + ${id}, <center><h1>Stalemate</h1>${game.boardHTML('W')}</center>`);
			Bot.say(room, `/sendhtmlpage ${game.B.player}, Chess + ${room} + ${id}, <center><h1>Stalemate</h1>${game.boardHTML('B')}</center>`);
			Bot.say(room, 'Stalemate! Game ended!');
			delete Bot.rooms[room].chess[id];
			sendEmbed(room, W, B, pgn);
			return;
			break;
		}
		case 'end': {
			let moves = Array.from(game.moves);
			game.result = '1/2-1/2';
			if (!moves) moves = [];
			moves.push('END');
			let W = game.W.name, B = game.B.name, pgn = tools.toPGN(game);
			fs.unlink(`./data/BACKUPS/chess-${room}-${id}.json`, e => {});
			Bot.say(room, `/adduhtml CHESS-${Date.now()},<center>${game.boardHTML(game.turn)}</center>`);
			game.spectatorSend(`<center><h1>Game Ended.</h1>${game.boardHTML()}</center>`);
			Bot.say(room, `/sendhtmlpage ${game.W.player}, Chess + ${room} + ${id}, <center><h1>Game Ended.</h1>${game.boardHTML('W')}</center>`);
			Bot.say(room, `/sendhtmlpage ${game.B.player}, Chess + ${room} + ${id}, <center><h1>Game Ended.</h1>${game.boardHTML('B')}</center>`);
			Bot.say(room, 'Game ended!');
			delete Bot.rooms[room].chess[id];
			sendEmbed(room, W, B, pgn);
			return;
			break;
		}
		case 'resign': {
			let side = info;
			game.spectatorSend(`<center><h1>Resigned.</h1>${game.boardHTML()}</center>`);
			Bot.say(room, `/sendhtmlpage ${game.W.player}, Chess + ${room} + ${id}, <center><h1>Resigned.</h1>${game.boardHTML('W')}</center>`);
			Bot.say(room, `/sendhtmlpage ${game.B.player}, Chess + ${room} + ${id}, <center><h1>Resigned.</h1>${game.boardHTML('B')}</center>`);
			Bot.say(room, `/adduhtml CHESS-${Date.now()},<center>${game.boardHTML()}</center>`);
			let moves = Array.from(game.moves);
			game.result = (side === "B" ? '1-0' : '0-1');
			if (!moves) moves = [];
			moves.push("RESIGN");
			let W = game.W.name, B = game.B.name, pgn = tools.toPGN(game);
			delete Bot.rooms[room].chess[id];
			fs.unlink(`./data/BACKUPS/chess-${room}-${id}.json`, e => {});
			Bot.say(room, 'Game ended!');
			sendEmbed(room, W, B, pgn);
			return;
			break;
		}
		default: return Bot.pm(game[game.turn].player, info);
	}
	fs.writeFile(`./data/BACKUPS/chess-${room}-${id}.json`, JSON.stringify(game), e => {
		if (e) console.log(e);
	});
}

module.exports = {
	cooldown: 1,
	help: `The Chess module. Use \`\`${prefix}chess new\`\` to make a game, and \`\`${prefix}chess spectate\`\` to watch. To resign, use \`\`${prefix}chess resign\`\``,
	permissions: 'none',
	commandFunction: function (Bot, room, time, by, args, client) {
		if (!args[0]) args.push('help');
		switch (args[0].toLowerCase()) {
			case 'help': case 'h': {
				if (tools.hasPermission(by, 'gamma', room)) return Bot.say(room, this.help);
				else Bot.pm(by, this.help);
				break;
			}
			case 'new': case 'n': {
				if (!tools.hasPermission(by, 'gamma', room)) return Bot.pm(by, 'Access denied.');
				if (!tools.canHTML(room)) return Bot.say(room, 'I can\'t do that here. Ask an RO to promote me or something.');
				if (!Bot.rooms[room].chess) Bot.rooms[room].chess = {};
				const id = Date.now();
				Bot.rooms[room].chess[id] = new tools.Chess(id, room);
				Bot.say(room, `/adduhtml CHESS-${id}, <HR><h1>Chess Signups have begun!</h1><button name="send" value="/msg ${Bot.status.nickName}, ${prefix}chess ${room}, join ${id} White">White</button><button name="send" value="/msg ${Bot.status.nickName}, ${prefix}chess ${room}, join ${id} Black">Black</button><HR>`);
				Bot.say(room, '/notifyrank all, Chess, A new game of chess has been created!, A new game of chess has been created.');
				return;
				break;
			}
			case 'join': case 'j': {
				if (!Bot.rooms[room].chess) return Bot.pm(by, 'There isn\'t an active chess game in this room.');
				if (!args[1]) return Bot.say(room, 'Please specify the ID / side.');
				let id, side, user = toId(by);
				if (args[2] && parseInt(args[1])) {
					id = args[1];
					side = args[2][0].toUpperCase();
					if (!["W", "B"].includes(side)) return Bot.pm(by, "I only accept white and black. (insert snarky comment)");
				}
				else if (Object.keys(Bot.rooms[room].chess).length === 1) {
					id = Object.keys(Bot.rooms[room].chess)[0];
					side = args[1][0].toUpperCase();
				}
				else {
					side = args[1][0].toUpperCase();
					if (!["W", "B"].includes(side)) return Bot.pm(by, "I only accept white and black. (insert snarky comment)");
					id = Object.keys(Bot.rooms[room].chess).find(k => {
						let game = Bot.rooms[room].chess[k];
						return game && !game.started && !game[side].player;
					});
					if (!id) return Bot.pm(by, "Sorry, unable to find any open games.");
				}
				let game = Bot.rooms[room].chess[id];
				if (!game) return Bot.pm(by, "Nope. BOOP");
				if (game.started) return Bot.pm(by, 'Too late!');
				if (game[side].player) return Bot.pm(by, "Sorry, already taken!");
				const other = side === 'W' ? 'B' : 'W';
				if (game[other].player === user) return Bot.pm(by, "~~You couldn't find anyone else to fight you? __Really__?~~");
				Bot.say(room, `${by.substr(1)} joined Chess (#${id}) as ${side === 'W' ? 'White' : 'Black'}!`);
				runMoves('join', {user: by.substr(1), side: side}, game);
				break;
			}
			case 'play': case 'move': {
				if (!Bot.rooms[room].chess) return Bot.pm(by, 'There isn\'t an active chess game in this room.');
				if (!args[1]) return Bot.pm(by, unxa);
				args.shift();
				if (!Object.keys(Bot.rooms[room].chess).length) return Bot.pm(by, "No games are active.");
				let id, user = toId(by);
				if (args[1]) id = args.shift().trim();
				else id = Object.keys(Bot.rooms[room].chess).find(k => {
					let game = Bot.rooms[room].chess[k];
					return game && game.started && !game[game.turn].player === user;
				});
				if (!id) return Bot.pm(by, "Unable to find the game you meant to play in.");
				let game = Bot.rooms[room].chess[id];
				if (!game) return Bot.pm(by, "Not a valid ID.");
				if (!game.started) return Bot.pm(by, 'OI, IT HASN\'T STARTED!');
				if (!(game[game.turn].player === toId(by))) return;
				let squares = args.join('').toLowerCase().split('-');
				delete game.W.isResigning;
				delete game.B.isResigning;
				game.play(game.turn, squares[0], squares[1], (run, info) => runMoves(run, info, game));
				break;
			}
			case 'premove': {
				if (!Bot.rooms[room].chess) return Bot.pm(by, 'There isn\'t an active chess game in this room.');
				if (!args[1]) return Bot.pm(by, unxa);
				args.shift();
				if (!Object.keys(Bot.rooms[room].chess).length) return Bot.pm(by, "No games are active.");
				let id, user = toId(by);
				if (args[1]) id = args.shift().trim();
				else id = Object.keys(Bot.rooms[room].chess).find(k => {
					let game = Bot.rooms[room].chess[k];
					return game && game.started && !game[game.turn].player === user;
				});
				if (!id) return Bot.pm(by, "Unable to find the game you meant to play in.");
				let game = Bot.rooms[room].chess[id];
				if (!game) return Bot.pm(by, "Not a valid ID.");
				if (!game.started) return Bot.pm(by, 'OI, IT HASN\'T STARTED!');
				let opp = game.turn === 'W' ? 'B' : 'W';
				if (!(game[opp].player === toId(by))) return;
				let squares = args.join('').toLowerCase().split('-');
				if (squares.length !== 2) return Bot.pm(by, `OMA A ${squres.length}-SQUARE PREMOVE! OUTSTANDING!`);
				game[opp].preMove = [squares[0], squares[1]];
				Bot.say(room, `/sendhtmlpage ${by}, Chess + ${room} + ${id}, <h1 style=\"text-align: center;\">Waiting for opponent...</h1><center>${game.boardHTML(opp)}</center>`);
				break;
			}
			case 'select': {
				if (!Bot.rooms[room].chess) return Bot.pm(by, 'This room does not have any chess games.');
				if (!args[1]) return Bot.pm(by, unxa);
				args.shift();
				let id, user = toId(by);
				if (!Object.keys(Bot.rooms[room].chess).length) return Bot.pm(by, "No games are active.");
				if (args[1]) id = args.shift().trim();
				else id = Object.keys(Bot.rooms[room].chess).find(k => {
					let game = Bot.rooms[room].chess[k];
					return game && game.started && !game[game.turn].player === user;
				});
				if (!id) return Bot.pm(by, "Unable to find the game you meant to play in.");
				let game = Bot.rooms[room].chess[id];
				if (!game) return Bot.pm(by, "Didn't find it.");
				if (!game.started) return Bot.pm(by, 'Let it start, nerd.');
				let square = args.join('').toLowerCase(), side = game.W.player === user ? 'W' : 'B';
				if (game[side].player !== user) return;
				let text = `<center>${game.boardHTML(side, square, game[game.turn].player === toId(by) ? game.getValidMoves(square, null) : game.getSquares(square, null, true))}</center>`;
				if (!text) return;
				Bot.say(room, `/sendhtmlpage ${by}, Chess + ${room} + ${id}, ${game.turn === side ? "<h1 style=\"text-align: center;\">Your turn!</h1>" : "<h1 style=\"text-align: center;\">Waiting for opponent...</h1>"}${text}`);
				break;
			}
			case 'deselect': {
				if (!Bot.rooms[room].chess) return Bot.pm(by, 'This room does not have any chess games.');
				args.shift();
				let id, user = toId(by);
				if (!Object.keys(Bot.rooms[room].chess).length) return Bot.pm(by, "No games are active.");
				if (args.length) id = args.shift().trim();
				else id = Object.keys(Bot.rooms[room].chess).find(k => {
					let game = Bot.rooms[room].chess[k];
					return game && game.started && !game[game.turn].player === user;
				});
				if (!id) return Bot.pm(by, "Unable to find the game you meant to play in.");
				let game = Bot.rooms[room].chess[id];
				if (!game.started) return Bot.pm(by, 'Let it start, nerd.');
				if (!(game[game.turn].player === toId(by))) return;
				return Bot.say(room, `/sendhtmlpage ${game[game.turn].player}, Chess + ${room} + ${id}, ${true ? "<h1 style=\"text-align: center;\">Your turn!</h1>" : "<h1 style=\"text-align: center;\">Waiting for opponent...</h1>"}<center>${game.boardHTML(game.turn)}</center>`);
				break;
			}
			case 'promote': {
				if (!Bot.rooms[room].chess) return Bot.pm(by, 'This room does not have any chess games.');
				args.shift();
				if (!args[1]) return Bot.pm(by, unxa);
				let id, user = toId(by);
				if (!Object.keys(Bot.rooms[room].chess).length) return Bot.pm(by, "No games are active.");
				if (args[2]) id = args.shift().trim();
				else id = Object.keys(Bot.rooms[room].chess).find(k => {
					let game = Bot.rooms[room].chess[k];
					return game && game.started && !game[game.turn].player === user;
				});
				if (!id) return Bot.pm(by, "Unable to find the game you meant to play in.");
				let game = Bot.rooms[room].chess[id];
				if (!game.started) return Bot.pm(by, 'Let it start, nerd.');
				if (!(game[game.turn].player === toId(by))) return;
				args = args.map(arg => arg.toLowerCase().trim());
				if (!/^[a-h][1-8]$/.test(args[0])) return Bot.pm(by, 'Invalid square! (You shouldn\'t be seeing this if you used the buttons)');
				let piece;
				switch (args[1]) {
					case 'knight': case 'n': piece = 'N'; break;
					case 'bishop': case 'b': piece = 'B'; break;
					case 'rook': case 'r': piece = 'R'; break;
					case 'queen': case 'q': piece = 'Q'; break;
					default: break;
				}
				if (!piece) return Bot.pm(by, 'Invalid piece!');
				if (!game[game.turn].isPromoting) return Bot.pm(by, `You're not promoting anything.`);
				game.promote(piece, args[0], game.turn, (run, info) => runMoves(run, info, game));
				break;
			}
			case 'substitute': case 'sub': {
				if (!tools.hasPermission(by, 'gamma', room)) return Bot.pm(by, 'Access denied.');
				if (!Bot.rooms[room].chess) return Bot.pm(by, 'This room does not have any chess games.');
				args.shift();
				let id, cargs;
				if (!Object.keys(Bot.rooms[room].chess).length) return Bot.pm(by, "No games are active.");
				if (/^[^a-zA-Z]+$/.test(args[0])) id = toId(args.shift());
				else if (Object.keys(Bot.rooms[room].chess).length === 1) id = Object.keys(Bot.rooms[room].chess)[0];
				else {
					cargs = args.join(' ').split(/\s*,\s*/);
					if (cargs.length !== 2) return Bot.pm(by, "I NEED TWO NAMES GIVE ME TWO NAMES");
					let id1 = toId(cargs[0]), id2 = toId(cargs[1]);
					id = Object.keys(Bot.rooms[room].chess).find(k => {
						let game = Bot.rooms[room].chess[k], ps = [game.W.player, game.B.player];
						return game && game.started && ((ps.includes(id1) && !ps.includes(id2)) || (!ps.includes(id1) && ps.includes(id2)));
					});
				}
				cargs = args.join(' ').replace(/[<>]/g, '').split(/\s*,\s*/);
				if (cargs.length !== 2) return Bot.pm(by, "I NEED TWO NAMES GIVE ME TWO NAMES");
				if (!id) return Bot.pm(by, "Sorry, I couldn't find a valid game to sub.");
				let game = Bot.rooms[room].chess[id];
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
				runMoves(1, null, game);
				break;
			}
			case 'end': case 'e': {
				if (!Bot.rooms[room].chess) return Bot.pm(by, 'This room does not have any chess games.');
				if (!tools.hasPermission(by, 'gamma', room)) return Bot.pm(by, 'Access denied.');
				args.shift();
				let id;
				if (!Object.keys(Bot.rooms[room].chess).length) return Bot.pm(by, "No games are active.");
				if (args.length && /^[^a-zA-Z]+$/.test(args.join(''))) id = toId(args.join(''));
				else if (Object.keys(Bot.rooms[room].chess).length === 1) id = Object.keys(Bot.rooms[room].chess)[0];
				else {
					let cargs = args.join('').split(/(?:,|\s+v(?:er)?s(?:us)?\.?\s+)/).map(toId);
					if (cargs.length !== 2) return Bot.pm(by, unxa);
					id = Object.keys(Bot.rooms[room].chess).find(k => {
						let game = Bot.rooms[room].chess[k];
						if (cargs.includes(game.W.player) && cargs.includes(game.B.player)) return true;
					});
				}
				if (!id) return Bot.pm(by, "Unable to find the game you're talking about. :(");
				let game = Bot.rooms[room].chess[id];
				if (!game) return Bot.pm(by, "Invalid ID.");
				if (!game.started) {
					delete Bot.rooms[room].chess[id];
					Bot.say(room, `/changeuhtml CHESS-${id}, Ended. :(`);
					return Bot.say(room, `Welp, ended Chess#${id}.`);
				}
				runMoves('end', null, game);
				break;
			}
			case 'restore': case 'resume': case 'r': {
				return Bot.pm(by, "Sorry, this isn't available!");
				if (!tools.hasPermission(by, 'gamma', room)) return Bot.pm(by, 'Access denied.');
				fs.readFile(`./data/BACKUPS/chess-${room}.json`, 'utf8', (e, file) => {
					if (e) return Bot.say(room, 'No games were found to restore.');
					let restore = JSON.parse(file);
					if (!restore) return Bot.say(room, 'No games were found to restore.');
					if (!restore.W.player || !restore.B.player) return Bot.say(room, `Uhh, that one was just in signups. Use \`\`${prefix}chess new force\`\` to make a new one instead!`);
					Bot.rooms[room].chess = new tools.Chess(room, restore);
					let game = Bot.rooms[room].chess;
					Bot.say(room, `The game was restored! ${game[game.turn].name}, your turn!`);
					Bot.say(room, `/sendhtmlpage ${game.W.name}, Chess (${Bot.rooms[room].title}), ${game.turn === "W" ? "<h1 style=\"text-align: center;\">Your turn!</h1>" : "<h1 style=\"text-align: center;\">Waiting for opponent...</h1>"}<center>${game.boardHTML('W')}</center>`);
					Bot.say(room, `/sendhtmlpage ${game.B.name}, Chess (${Bot.rooms[room].title}), ${game.turn === "B" ? "<h1 style=\"text-align: center;\">Your turn!</h1>" : "<h1 style=\"text-align: center;\">Waiting for opponent...</h1>"}<center>${game.boardHTML('B')}</center>`);
					game.spectators .forEach(name => Bot.say(room, `/sendhtmlpage ${name}, Chess (${Bot.rooms[room].title}), <center><h1>${game[game.turn].name}'s Turn (${game.turn})</h1>${game.boardHTML()}</center>`));
					// more
				});
				break;
			}
			case 'board': case 'b': case 'theme': {
				if (!Bot.rooms[room].chess) return Bot.pm(by, 'This room does not have any chess games.');
				if (!tools.hasPermission(by, 'alpha', room)) return Bot.pm(by, 'Access denied.');
				args.shift();
				let id;
				if (!Object.keys(Bot.rooms[room].chess).length) return Bot.pm(by, "No games are active.");
				if (args.length && /^[^a-zA-Z]+$/.test(args[0])) id = toId(args.shift());
				else if (Object.keys(Bot.rooms[room].chess).length === 1) id = Object.keys(Bot.rooms[room].chess)[0];
				else if (Object.values(Bot.rooms[room].chess).filter(game => game.W.player && game.B.player).length === 1) id = Object.values(Bot.rooms[room].chess).filter(game => game.W.player && game.B.player)[0].id;
				else {
					let cargs = args.join(' ').split(/,/)[0].split(/(?:\/|\s+v(?:er)?s(?:us)?\.?\s+)/).map(toId);
					if (cargs.length !== 2) return Bot.pm(by, unxa);
					id = Object.keys(Bot.rooms[room].chess).find(k => {
						let game = Bot.rooms[room].chess[k];
						if (cargs.includes(game.W.player) && cargs.includes(game.B.player)) return true;
					});
				}
				if (!id) return Bot.pm(by, "Unable to find the game you're talking about. :(");
				let game = Bot.rooms[room].chess[id], cs = game.colours;
				if (!game) return Bot.pm(by, "Invalid ID.");
				let cargs = args.join(' ').split(/,/), given = toId(cargs.pop());
				let aliases = {
					"normal": "default",
					"original": "default",
					"emerald": "green",
					"snow": "pristine",
					"seafloor": "ocean",
					"midnight": "spooky",
					"halloween": "spooky"
				}
				given = aliases[given] || given;
				let colourSRC = JSON.parse(fs.readFileSync('./data/DATA/chess_themes.json', 'utf8'))[given];
				if (!colourSRC) return Bot.pm(by, "Sorry, didn't find that theme!");
				game.colours = colourSRC;
				runMoves(1, null, game);
				return;
				break;
			}
			case 'menu': case 'list': case 'l': case 'players': {
				let chess = Bot.rooms[room].chess;
				if (!chess || !Object.keys(chess).length) {
					if (tools.hasPermission(by, 'gamma', room)) return Bot.say(room, "Sorry, no games found.");
					return Bot.pm(by, "Sorry, no games found.");
				}
				let html = `<hr />${Object.keys(chess).map(id => {
					let game = chess[id];
					return `${game.W.name ? tools.colourize(game.W.name) : `<button name="send" value="/msg ${Bot.status.nickName}, ${prefix}chess ${room} join ${id} White">White</button>`} vs ${game.B.name ? tools.colourize(game.B.name) : `<button name="send" value="/msg ${Bot.status.nickName}, ${prefix}chess ${room} join ${id} Black">Black</button>`} ${game.started ? `<button name="send" value ="/msg ${Bot.status.nickName}, ${prefix}chess ${room} spectate ${id}">Watch</button> ` : ''}(#${id})`;
				}).join('<br />')}<hr />`;
				let staffHTML = `<hr />${Object.keys(chess).map(id => {
					let game = chess[id];
					return `${game.W.name ? tools.colourize(game.W.name) : `<button name="send" value="/msg ${Bot.status.nickName}, ${prefix}chess join ${id} White">White</button>`} vs ${game.B.name ? tools.colourize(game.B.name) : `<button name="send" value="/msg ${Bot.status.nickName}, ${prefix}chess ${room} join ${id} Black">Black</button>`} ${game.started ? `<button name="send" value ="/msg ${Bot.status.nickName}, ${prefix}chess ${room} spectate ${id}">Watch</button> ` : ''}${tools.hasPermission(by, 'gamma', room) ? `<button name="send" value="/msg ${Bot.status.nickName}, ${prefix}chess ${room} end ${id}">End</button> ` : ''}(#${id})`;
				}).join('<br />')}<hr />`;
				if (tools.hasPermission(by, 'gamma', room)) {
					Bot.say(room, `/adduhtml CHESSMENU,${html}`);
					Bot.sendHTML(by, staffHTML);
				}
				else Bot.sendHTML(by, html);
				break;
			}
			case 'resign': case 'forfeit': case 'f': case 'ff': case 'ihavebeenpwned': case 'bully': {
				if (!Bot.rooms[room].chess) return Bot.pm(by, 'There isn\'t an active chess game in this room.');
				args.shift();
				let id, user = toId(by);
				if (args.length) id = toId(args.join(''));
				else if (Object.keys(Bot.rooms[room].chess).length === 1) id = Object.keys(Bot.rooms[room].chess)[0];
				else id = Object.keys(Bot.rooms[room].chess).find(k => {
					let game = Bot.rooms[room].chess[k];
					return game && game.started && [game.W.player, game.B.player].includes(user);
				});
				if (!id) return Bot.pm(by, "Unable to find the game you meant to play in.");
				let game = Bot.rooms[room].chess[id];
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
			case 'challenge': {
				return Bot.pm(by, "Sorry, this feature has been disabled until PartMan rewrites it properly.");
				if (room.startsWith('groupchat-')) return Bot.pm(by, "You can't challenge someone in a groupchat, sorry...");
				if (!tools.canHTML(room)) return Bot.say(room, 'Sorry, I lack the permissions to do that here...');
				if (!args.length) return Bot.pm(by, 'Who do you want to challenge?');
				if (Bot.rooms[`groupchat-${room}-${toId(by)}`]) return Bot.pm(by, 'You can only challenge one person at a time.');
				args.shift();
				if (!Bot.rooms[room].users.includes(toId(args.join('')))) return Bot.say(room, "I can't find that user...");
				if (toId(args.join('')) == toId(Bot.status.nickName)) return Bot.pm(by, 'Seriously? Me?');
				if (!Bot.rooms[room].pendingChessChallenges) Bot.rooms[room].pendingChessChallenges = {};
				Bot.rooms[room].pendingChessChallenges[toId(args.join(''))] = toId(by);
				Bot.say(room, `/subroomgroupchat ${by.substr(1)}`);
				let gc = `groupchat-${room}-${toId(by)}`;
				Bot.say(room, `${by.substr(1)} has challenged ${args.join(' ')} to a match of chess! <<${gc}>>`);
				Bot.say(gc, `/roomvoice ${by}\n/roomvoice ${args.join(' ')}`);
				Bot.say(gc, '/modchat +');
				if (!Bot.chessGroupchats) Bot.chessGroupchats = [];
				Bot.chessGroupchats.push(gc);
				break;
			}
			case 'spectate': case 's': case 'watch': case 'w': {
				if (!Bot.rooms[room].chess) return Bot.pm(by, 'This room does not have any chess games.');
				args.shift();
				let id;
				if (args.length && /^[^a-zA-Z]+$/.test(args.join(''))) id = toId(args.join(''));
				else if (Object.keys(Bot.rooms[room].chess).length === 1) id = Object.keys(Bot.rooms[room].chess)[0];
				else if (Object.keys(Bot.rooms[room].chess).filter(game => game.started).length === 1) id = Object.keys(Bot.rooms[room].chess)[0];
				else {
					let cargs = args.join('').split(/(?:,|\s+v(?:er)?s(?:us)?\.?\s+)/).map(toId);
					if (cargs.length !== 2) return Bot.pm(by, "Sorry, specify the players again?");
					id = Object.keys(Bot.rooms[room].chess).find(k => {
						let game = Bot.rooms[room].chess[k];
						if (cargs.includes(game.W.player) && cargs.includes(game.B.player) && !game.spectators.includes(toId(by))) return true;
					});
				}
				let game = Bot.rooms[room].chess[id];
				if (!game) return Bot.pm(by, "Sorry, no chess game here to spectate.");
				if (!game.started) Bot.pm(by, "Oki, I'll send you the board when it starts.");
				let user = toId(by);
				if (game.spectators.includes(user)) return Bot.pm(by, `You're already spectating! If you want to stop, use \`\`${prefix}chess unspectate\`\` instead!`);
				if ([game.W.player, game.B.player].includes(user)) return Bot.pm(by, "Imagine spectating your own game.");
				game.spectators.push(user);
				Bot.say(room, `/sendhtmlpage ${by}, Chess + ${room} + ${id}, <center><h1>${game[game.turn].name}'s Turn (${game.turn})</h1>${game.boardHTML()}</center>`);
				return Bot.pm(by, `You are now spectating the chess match between ${game.W.name} and ${game.B.name}!`);
				break;
			}
			case 'unspectate': case 'us': case 'unwatch': case 'uw': {
				if (!Bot.rooms[room].chess) return Bot.pm(by, 'This room does not have any chess games.');
				args.shift();
				let id;
				if (args.length && /^[^a-zA-Z]+$/.test(args.join(''))) id = toId(args.join(''));
				else if (Object.values(Bot.rooms[room].chess).filter(game => game.spectators.includes(toId(by))).length === 1) id = Object.values(Bot.rooms[room].chess).filter(game => game.spectators.includes(toId(by)))[0].id;
				else {
					let cargs = args.join('').split(/(?:,|\s+v(?:er)?s(?:us)?\.?\s+)/).map(toId);
					if (cargs.length !== 2) return Bot.pm(by, "Sorry, didn't get the game you meant.");
					id = Object.keys(Bot.rooms[room].chess).find(k => {
						let game = Bot.rooms[room].chess[k];
						if (cargs.includes(game.W.player) && cargs.includes(game.B.player) && game.spectators.includes(toId(by))) return true;
					});
				}
				let game = Bot.rooms[room].chess[id];
				if (!game) return Bot.pm(by, "Sorry, no chess game here to unspectate.");
				if (!game.started) return Bot.pm(by, "AYAYAYA - no.");
				let user = toId(by);
				if ([game.W.player, game.B.player].includes(user)) return Bot.pm(by, "Imagine unspectating your own game.");
				if (!game.spectators.includes(user)) return Bot.pm(by, `You aren't spectating! If you want to, use \`\`${prefix}chess spectate\`\` instead!`);
				game.spectators.remove(user);
				return Bot.pm(by, `You are no longer spectating the chess match between ${game.W.name} and ${game.B.name}.`);
				break;
			}
			case 'rejoin': case 'rj': {
				let games = Bot.rooms[room].chess;
				if (!games) return Bot.pm(by, "Sorry, no chess game here to spectate.");
				let user = toId(by);
				let ids = Object.keys(games).filter(key => [games[key].W.player, games[key].B.player, ...games[key].spectators].includes(user));
				if (!ids.length) return Bot.pm(by, "Couldn't find any games for you to rejoin.");
				ids.forEach(id => {
					let game = games[id], side;
					if (game.W.player === user) side = "W";
					if (game.B.player === user) side = "B";
					if (!side && !game.spectators.includes(toId(by))) return Bot.pm(by, `You don't look like a player / spectator - try ${prefix}chess spectate ${id}... ;-;`);
					if (game.spectators.includes(user)) Bot.say(room, `/sendhtmlpage ${by}, Chess + ${room} + ${id}, <center><h1>${game[game.turn].name}'s Turn (${game.turn})</h1>${game.boardHTML()}</center>`);
					else Bot.say(room, `/sendhtmlpage ${user}, Chess + ${room} + ${id}, ${game.turn === side ? "<h1 style=\"text-align: center;\">Your turn!</h1>" : "<h1 style=\"text-align: center;\">Waiting for opponent...</h1>"}<center>${game.boardHTML(side)}</center>`);
				});
				break;
			}
			case 'themepreview': case 'preview': case 'tp': {
				if (!tools.hasPermission(by, 'gamma', room)) return Bot.pm(by, "Access denied.");
				args.shift();
				if (!args.length) return Bot.pm(by, unxa);
				if (args.length === 1) args.unshift('white');
				args = args.map(col => col.replace(/[^a-zA-Z0-9#,\(\)\.]/g, ''));
				let cs = {};
				['W', 'B', 'sel', 'hl', 'last'].forEach((term, index) => {
					let def;
					if (term === 'sel') def = '#87CEFA'
					if (term === 'hl') def = 'rgba(173, 255, 47, 0.9)';
					if (term === 'last') def = 'rgba(255, 51, 0, 0.1)';
					cs[term] = args[index] || (def || null);
				});
				let html = `<center><table style="text-align: center; border-collapse:collapse;" border="1"><tr style="text-align: center; height: 15;"><th width="15" height="15"></th><th width="40">A</th><th width="40">B</th><th width="40">C</th><th width="40">D</th><th width="40">E</th><th width="40">F</th><th width="40">G</th><th width="40">H</th><th width="15"></th></tr><tr style="text-align: center; height: 40;"><td height="40"><b><center>8</center></b></td><td style="text-align: center; background: LIGHT_SQUARE;" height="40" width="40"><img src="http://51.79.52.188:8080/public/chess/BR.png" height="25" width="25" style="text-align: center; height: 25; width: 25" /></td><td style="text-align: center; background: DARK_SQUARE;" height="40" width="40"><img src="http://51.79.52.188:8080/public/chess/BN.png" height="25" width="25" style="text-align: center; height: 25; width: 25" /></td><td style="text-align: center; background: LIGHT_SQUARE;" height="40" width="40"><img src="http://51.79.52.188:8080/public/chess/BB.png" height="25" width="25" style="text-align: center; height: 25; width: 25" /></td><td style="text-align: center; background: DARK_SQUARE;" height="40" width="40"><img src="http://51.79.52.188:8080/public/chess/BQ.png" height="25" width="25" style="text-align: center; height: 25; width: 25" /></td><td style="text-align: center; background: LIGHT_SQUARE;" height="40" width="40"><img src="http://51.79.52.188:8080/public/chess/BK.png" height="25" width="25" style="text-align: center; height: 25; width: 25" /></td><td style="text-align: center; background: DARK_SQUARE;" height="40" width="40"><img src="http://51.79.52.188:8080/public/chess/BB.png" height="25" width="25" style="text-align: center; height: 25; width: 25" /></td><td style="text-align: center; background: LIGHT_SQUARE;" height="40" width="40"><img src="http://51.79.52.188:8080/public/chess/BN.png" height="25" width="25" style="text-align: center; height: 25; width: 25" /></td><td style="text-align: center; background: DARK_SQUARE;" height="40" width="40"><img src="http://51.79.52.188:8080/public/chess/BR.png" height="25" width="25" style="text-align: center; height: 25; width: 25" /></td><th>8</th></tr><tr style="text-align: center; height: 40;"><td height="40"><b><center>7</center></b></td><td style="text-align: center; background: DARK_SQUARE;" height="40" width="40"><img src="http://51.79.52.188:8080/public/chess/BP.png" height="25" width="25" style="text-align: center; height: 25; width: 25" /></td><td style="text-align: center; background: LIGHT_SQUARE;" height="40" width="40"><img src="http://51.79.52.188:8080/public/chess/BP.png" height="25" width="25" style="text-align: center; height: 25; width: 25" /></td><td style="text-align: center; background: DARK_SQUARE;" height="40" width="40"><img src="http://51.79.52.188:8080/public/chess/BP.png" height="25" width="25" style="text-align: center; height: 25; width: 25" /></td><td style="text-align: center; background: LIGHT_SQUARE;" height="40" width="40"></td><td style="text-align: center; background: DARK_SQUARE;" height="40" width="40"><img src="http://51.79.52.188:8080/public/chess/BP.png" height="25" width="25" style="text-align: center; height: 25; width: 25" /></td><td style="text-align: center; background: LIGHT_SQUARE;" height="40" width="40"><img src="http://51.79.52.188:8080/public/chess/BP.png" height="25" width="25" style="text-align: center; height: 25; width: 25" /></td><td style="text-align: center; background: DARK_SQUARE;" height="40" width="40"><img src="http://51.79.52.188:8080/public/chess/BP.png" height="25" width="25" style="text-align: center; height: 25; width: 25" /></td><td style="text-align: center; background: LIGHT_SQUARE;" height="40" width="40"><img src="http://51.79.52.188:8080/public/chess/BP.png" height="25" width="25" style="text-align: center; height: 25; width: 25" /></td><th>7</th></tr><tr style="text-align: center; height: 40;"><td height="40"><b><center>6</center></b></td><td style="text-align: center; background: LIGHT_SQUARE;" height="40" width="40"></td><td style="text-align: center; background: DARK_SQUARE;" height="40" width="40"></td><td style="text-align: center; background: LIGHT_SQUARE;" height="40" width="40"></td><td style="text-align: center; background: DARK_SQUARE;" height="40" width="40"></td><td style="text-align: center; background: LIGHT_SQUARE;" height="40" width="40"></td><td style="text-align: center; background: DARK_SQUARE;" height="40" width="40"></td><td style="text-align: center; background: LIGHT_SQUARE;" height="40" width="40"></td><td style="text-align: center; background: DARK_SQUARE;" height="40" width="40"></td><th>6</th></tr><tr style="text-align: center; height: 40;"><td height="40"><b><center>5</center></b></td><td style="text-align: center; background: DARK_SQUARE;" height="40" width="40"></td><td style="text-align: center; background: LIGHT_SQUARE;" height="40" width="40"></td><td style="text-align: center; background: DARK_SQUARE;" height="40" width="40"></td><td style="text-align: center; background: LIGHT_SQUARE;" height="40" width="40"></td><td style="text-align: center; background: DARK_SQUARE;" height="40" width="40"></td><td style="text-align: center; background: LIGHT_SQUARE;" height="40" width="40"></td><td style="text-align: center; background: DARK_SQUARE;" height="40" width="40"></td><td style="text-align: center; background: LIGHT_SQUARE;" height="40" width="40"></td><th>5</th></tr><tr style="text-align: center; height: 40;"><td height="40"><b><center>4</center></b></td><td style="text-align: center; background: LIGHT_SQUARE;" height="40" width="40"></td><td style="text-align: center; background: DARK_SQUARE;" height="40" width="40"></td><td style="text-align: center; background: LIGHT_SQUARE;" height="40" width="40"></td><td style="text-align: center; background: DARK_SQUARE;" height="40" width="40"><img src="http://51.79.52.188:8080/public/chess/WP.png" height="25" width="25" style="text-align: center; height: 25; width: 25" /></td><td style="text-align: center; background: LAST_LIGHT_SQUARE;" height="40" width="40"></td><td style="text-align: center; background: DARK_SQUARE;" height="40" width="40"></td><td style="text-align: center; background: LIGHT_SQUARE;" height="40" width="40"></td><td style="text-align: center; background: DARK_SQUARE;" height="40" width="40"></td><th>4</th></tr><tr style="text-align: center; height: 40;"><td height="40"><b><center>3</center></b></td><td style="text-align: center; background: DARK_SQUARE;" height="40" width="40"></td><td style="text-align: center; background: LIGHT_SQUARE;" height="40" width="40"></td><td style="text-align: center; background: DARK_SQUARE;" height="40" width="40"></td><td style="text-align: center; background: HL_LIGHT_SQUARE;" height="40" width="40"></td><td style="text-align: center; background: LAST_DARK_SQUARE;" height="40" width="40"></td><td style="text-align: center; background: HL_LIGHT_SQUARE;" height="40" width="40"></td><td style="text-align: center; background: DARK_SQUARE;" height="40" width="40"></td><td style="text-align: center; background: LIGHT_SQUARE;" height="40" width="40"></td><th>3</th></tr><tr style="text-align: center; height: 40;"><td height="40"><b><center>2</center></b></td><td style="text-align: center; background: LIGHT_SQUARE;" height="40" width="40"><img src="http://51.79.52.188:8080/public/chess/WP.png" height="25" width="25" style="text-align: center; height: 25; width: 25" /></td><td style="text-align: center; background: DARK_SQUARE;" height="40" width="40"><img src="http://51.79.52.188:8080/public/chess/WP.png" height="25" width="25" style="text-align: center; height: 25; width: 25" /></td><td style="text-align: center; background: LIGHT_SQUARE;" height="40" width="40"><img src="http://51.79.52.188:8080/public/chess/WP.png" height="25" width="25" style="text-align: center; height: 25; width: 25" /></td><td style="text-align: center; background: HL_DARK_SQUARE;" height="40" width="40"></td><td style="text-align: center; background: HL_LIGHT_SQUARE;" height="40" width="40"><img src="http://51.79.52.188:8080/public/chess/BP.png" height="25" width="25" style="text-align: center; height: 25; width: 25" /></td><td style="text-align: center; background: DARK_SQUARE;" height="40" width="40"><img src="http://51.79.52.188:8080/public/chess/WP.png" height="25" width="25" style="text-align: center; height: 25; width: 25" /></td><td style="text-align: center; background: LIGHT_SQUARE;" height="40" width="40"><img src="http://51.79.52.188:8080/public/chess/WP.png" height="25" width="25" style="text-align: center; height: 25; width: 25" /></td><td style="text-align: center; background: DARK_SQUARE;" height="40" width="40"><img src="http://51.79.52.188:8080/public/chess/WP.png" height="25" width="25" style="text-align: center; height: 25; width: 25" /></td><th>2</th></tr><tr style="text-align: center; height: 40;"><td height="40"><b><center>1</center></b></td><td style="text-align: center; background: DARK_SQUARE;" height="40" width="40"><img src="http://51.79.52.188:8080/public/chess/WR.png" height="25" width="25" style="text-align: center; height: 25; width: 25" /></td><td style="text-align: center; background: LIGHT_SQUARE;" height="40" width="40"><img src="http://51.79.52.188:8080/public/chess/WN.png" height="25" width="25" style="text-align: center; height: 25; width: 25" /></td><td style="text-align: center; background: DARK_SQUARE;" height="40" width="40"><img src="http://51.79.52.188:8080/public/chess/WB.png" height="25" width="25" style="text-align: center; height: 25; width: 25" /></td><td style="text-align: center; background: SELECTED_SQUARE;" height="40" width="40"><img src="http://51.79.52.188:8080/public/chess/WQ.png" height="25" width="25" style="text-align: center; height: 25; width: 25" /></td><td style="text-align: center; background: DARK_SQUARE;" height="40" width="40"><img src="http://51.79.52.188:8080/public/chess/WK.png" height="25" width="25" style="text-align: center; height: 25; width: 25" /></td><td style="text-align: center; background: LIGHT_SQUARE;" height="40" width="40"><img src="http://51.79.52.188:8080/public/chess/WB.png" height="25" width="25" style="text-align: center; height: 25; width: 25" /></td><td style="text-align: center; background: DARK_SQUARE;" height="40" width="40"><img src="http://51.79.52.188:8080/public/chess/WN.png" height="25" width="25" style="text-align: center; height: 25; width: 25" /></td><td style="text-align: center; background: LIGHT_SQUARE;" height="40" width="40"><img src="http://51.79.52.188:8080/public/chess/WR.png" height="25" width="25" style="text-align: center; height: 25; width: 25" /></td><th>1</th></tr><tr height="15"><th height="15"></th><th height="15">A</th><th height="15">B</th><th height="15">C</th><th height="15">D</th><th height="15">E</th><th height="15">F</th><th height="15">G</th><th height="15">H</th><th height="15"></th></tr></table></center>`;
				html = html.replace(/LAST_LIGHT_SQUARE/g, `linear-gradient(${cs.last}, ${cs.last}), linear-gradient(${cs.W}, ${cs.W})`).replace(/LAST_DARK_SQUARE/g, `linear-gradient(${cs.last}, ${cs.last}), linear-gradient(${cs.B}, ${cs.B})`).replace(/HL_LIGHT_SQUARE/g, `linear-gradient(${cs.hl}, ${cs.hl}), linear-gradient(${cs.W}, ${cs.W})`).replace(/HL_DARK_SQUARE/g, `linear-gradient(${cs.hl}, ${cs.hl}), linear-gradient(${cs.B}, ${cs.B})`).replace(/LIGHT_SQUARE/g, cs.W).replace(/DARK_SQUARE/g, cs.B).replace(/SELECTED_SQUARE/g, cs.sel);
				Bot.say(room, `/adduhtml CHESS_PREVIEW, ${html}`);
				break;
			}
			default: {
				Bot.pm(by, `That, uhh, doesn't seem to be something I recognize?`);
				break;
			}
		}
	}
}
