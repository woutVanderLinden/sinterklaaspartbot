module.exports = {
	cooldown: 1,
	help: `https://www.worldothello.org/about/about-othello/othello-rules/official-rules/english`,
	permissions: 'none',
	commandFunction: function (Bot, room, time, by, args, client) {
		if (!args.length) args.push('help');
		switch (toId(args[0])) {
			case 'help': case 'h': {
				return Bot.say(room, 'https://www.worldothello.org/about/about-othello/othello-rules/official-rules/english');
				break;
			}
			case 'join': case 'j': {
				if (!Bot.rooms[room].othello) return Bot.pm(by, 'There isn\'t an active Othello game in this room.');
				if (!args[1]) return Bot.say(room, 'Please specify the side.');
				let game = Bot.rooms[room].othello;
				if (game.started) return Bot.pm(by, 'Too late!');
				switch (args[1][0].toLowerCase()) {
					case 'w': {
						if (game.W.player) return Bot.pm(by, "Sorry, White's already taken!");
						game.W.player = toId(by);
						game.W.name = by.substr(1);
						if (!game.B.player) return Bot.say(room, `${by.substr(1)} joined the game as White!\n/adduhtml OTHELLO, <H1>Othello Signups have begun!</H1><BUTTON name="send" value="/msg ${Bot.status.nickName}, ${prefix}othello ${room}, join Black">Black</BUTTON>`);
						else {							
							if (game.B.player === game.W.player) {
								game.W.player = null;
								game.W.name = null;
								return Bot.pm(by, 'Nope, not allowed to fight yourself.');
							}
							Bot.say(room, `The match between ${game.W.name} and ${game.B.name} is starting!`);
							game.start();
							return Bot.say(room, `/adduhtml OTHELLO,${game.display()}<br /><br /><div style="color: ${game.turn === 'W' ? 'white' : 'black'}; background-color: #808080; text-align: center;"><h1>${game[game.turn].name.replace(/</g, '&lt;').replace(/>/g, '&gt;')}'s Turn!</h1></div>`);
						}
					}
					case 'b': {
						if (game.B.player) return Bot.pm(by, "Sorry, Black's already taken!");
						game.B.player = toId(by);
						game.B.name = by.substr(1);
						if (!game.W.player) return Bot.say(room, `${by.substr(1)} joined the game as Black!\n/adduhtml OTHELLO, <H1>Othello Signups have begun!</H1><BUTTON name="send" value="/msg ${Bot.status.nickName}, ${prefix}othello ${room}, join White">White</BUTTON>`);
						else {
							if (game.B.player === game.W.player) {
								game.B.player = null;
								game.B.name = null;
								return Bot.pm(by, 'Nope, not allowed to fight yourself.');
							}
							Bot.say(room, `The match between ${game.W.name} and ${game.B.name} is starting!`);
							game.start();
							return Bot.say(room, `/adduhtml OTHELLO,${game.display()}<br /><br /><div style="color: ${game.turn === 'W' ? 'white' : 'black'}; background-color: #808080; text-align: center;"><h1>${game[game.turn].name.replace(/</g, '&lt;').replace(/>/g, '&gt;')}'s Turn!</h1></div>`);
						}
					}
					default: return Bot.pm(by, 'Whoa, that\'s not a valid colour.')
				}
				break;
			}
			case 'new': case 'n': {
				if (Bot.rooms[room].othello) return Bot.pm(by, 'A game of Othello is already active!');
				if (!tools.hasPermission(by, 'gamma', room)) return Bot.pm(by, 'Access denied.');
				fs.readFile(`./data/BACKUPS/othello-${room}.json`, 'utf8', (err, file) => {
					if (err) file = null;
					if (file && (!args[1] || !['force', 'confirm', 'f'].includes(args[1].toLowerCase()))) return Bot.say(room, `A backup for an interrupted game was found. Use \`\`${prefix}othello new force\`\` to create a new game, or \`\`${prefix}othello restore\`\` to restore it!`);
					else if (file) fs.unlink(`./data/BACKUPS/othello-${room}.json`, e => {});
					Bot.rooms[room].othello = new tools.Othello(room);
					Bot.say(room, `/adduhtml OTHELLO, <H1>Othello Signups have begun!</H1><BUTTON name="send" value="/msg ${Bot.status.nickName}, ${prefix}othello ${room}, join White">White</BUTTON><BUTTON name="send" value="/msg ${Bot.status.nickName}, ${prefix}othello ${room}, join Black">Black</BUTTON>`);
				});
				break;
			}
			case 'click': {
				if (!Bot.rooms[room].othello) return Bot.pm(by, 'There isn\'t an active Othello game in this room.');
				if (!args[1]) return Bot.pm(by, unxa);
				args.shift();
				let game = Bot.rooms[room].othello;
				if (!game.started) return Bot.pm(by, 'OI, IT HASN\'T STARTED!');
				if (game[game.turn].player !== toId(by)) return;
				let move = args.join('').replace(/[^0-9,]/g, '').split(',');
				if (move.length !== 2) return Bot.pm(by, unxa);
				move = move.map(term => parseInt(term));
				if (!game.canPlay(...move)) return Bot.pm(by, "Can't play there.");
				game.play(...move);
				let idle = game.nextTurn();
				if (idle.length === 1) {
					Bot.say(room, `/adduhtml OTHELLO,${game.display()}<br /><br /><div style="color: ${game.turn === 'W' ? 'white' : 'black'}; background-color: #808080; text-align: center;"><h1>${game[game.turn].name.replace(/</g, '&lt;').replace(/>/g, '&gt;')}'s Turn!</h1></div>`);
					fs.writeFile(`./data/BACKUPS/othello-${room}.json`, JSON.stringify(Bot.rooms[room].othello), e => {
						if (e) console.log(e);
					});
					return Bot.say(room, '/notifyrank all, Othello, Your turn!, ' + game[game.turn].name);
				}
				Bot.say(room, `/adduhtml OTHELLO,${game.display()}`);
				let ex = JSON.parse(idle);
				if (ex[ex.winner]) Bot.say(room, `Game ended! ${ex[ex.winner].name || 'No one'} won!`);
				else Bot.say(room, "OMA A TIE GG");
				fs.unlink(`./data/BACKUPS/othello-${room}.json`, e => {});
				const Embed = require('discord.js').MessageEmbed;
				let embed = new Embed().setColor('#008000').setAuthor('Othello - Room Match').setTitle(ex.winner === 'W' ? `**${game.W.name}** vs ${game.B.name}` : (ex.winner === 'B' ? `${game.W.name} vs **${game.B.name}**` : `${game.W.name} vs ${game.B.name}`)).addField("\u200b", Object.values(game.board).map(row => row.map(cell => {
					switch (cell) {
						case 'B': {
							return ':black_circle:';
							break;
						}
						case 'W': {
							return ':white_circle:';
							break;
						}
						default: return ':green_square:';
					}
				}).join('')).join('\n'));
				delete Bot.rooms[room].othello;
				client.channels.cache.get("576488243126599700").send(embed);
				break;
			}
			case 'substitute': case 'sub': {
				if (!Bot.rooms[room].othello) return Bot.pm(by, 'This room does not have any Othello games.');
				let game = Bot.rooms[room].othello;
				if (!game.started) return Bot.pm(by, 'Excuse me?');
				if (!tools.hasPermission(by, 'gamma', room)) return Bot.pm(by, 'Access denied.');
				args.shift();
				let cargs = args.join(' ').split(',');
				if (cargs.length !== 2) return Bot.say(room, unxa);
				cargs = cargs.map(carg => carg.trim());
				let users = cargs.map(carg => toId(carg));
				if ((users.includes(game.W.player) && users.includes(game.B.player)) || (!users.includes(game.W.player) && !users.includes(game.B.player))) return Bot.say(room, 'Those users? Something\'s wrong with those...');
				if (users.includes(game.W.player)) {
					if (users[0] == game.W.player) {
						Bot.say(room, `${game.W.name} was subbed with ${cargs[1]}!`);
						game.W.player = users[1];
						game.W.name = cargs[1];
						return;
					}
					else {
						Bot.say(room, `${game.W.name} was subbed with ${cargs[0]}!`);
						game.W.player = users[0];
						game.W.name = cargs[0];
						return;
					}
				}
				else {
					if (users[0] == game.B.player) {
						Bot.say(room, `${game.B.name} was subbed with ${cargs[1]}!`);
						game.B.player = users[1];
						game.B.name = cargs[1];
						return;
					}
					else {
						Bot.say(room, `${game.B.name} was subbed with ${cargs[0]}!`);
						game.B.player = users[0];
						game.B.name = cargs[0];
						return;
					}
				}
				break;
			}
			case 'resign': case 'forfeit': case 'f': case 'ihavebeenpwned': case 'ff': {
				if (!Bot.rooms[room].othello) return Bot.pm(by, 'This room does not have any Othello games.');
				let game = Bot.rooms[room].othello, user = toId(by);
				if (!game.started) return Bot.pm(by, '>resigning before it starts');
				if (![game.W.player, game.B.player].includes(user)) return Bot.pm(by, "Only a player can resign.");
				if (!game[game.turn].isResigning) {
					Bot.pm(by, 'Are you sure you want to resign? If you are, use this command again.');
					return game[game.turn].isResigning = true;
				}
				fs.unlink(`./data/BACKUPS/othello-${room}.json`, e => {});
				Bot.say(room, 'Game ended! GG!');
				let ex = {
					winner: game.W.player === user ? 'W' : 'B'
				}
				const Embed = require('discord.js').MessageEmbed;
				let embed = new Embed().setColor('#008000').setAuthor('Othello - Room Match').setTitle(ex.winner === 'W' ? `**${game.W.name}** vs ${game.B.name}` : (ex.winner === 'B' ? `${game.W.name} vs **${game.B.name}**` : `${game.W.name} vs ${game.B.name}`)).addField("\u200b", Object.values(game.board).map(row => row.map(cell => {
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
				delete Bot.rooms[room].othello;
				if (['boardgames'].includes(room)) client.channels.cache.get("576488243126599700").send(embed);
				break;
			}
			case 'end': case 'e': {
				if (!Bot.rooms[room].othello) return Bot.pm(by, 'This room does not have any Othello games.');
				let game = Bot.rooms[room].othello;
				if (!game.started) {
					delete Bot.rooms[room].othello;
					Bot.say(room, '/adduhtml OTHELLO, Boop.');
					return Bot.say(room, 'Welp, ended.');
				}
				if (!tools.hasPermission(by, 'gamma', room)) return Bot.pm(by, 'Access denied.');
				fs.unlink(`./data/BACKUPS/othello-${room}.json`, e => {});
				delete Bot.rooms[room].othello;
				Bot.say(room, 'Game ended!');
				break;
			}
			case 'restore': case 'resume': case 'r': {
				if (!tools.hasPermission(by, 'gamma', room)) return Bot.pm(by, 'Access denied.');
				fs.readFile(`./data/BACKUPS/othello-${room}.json`, 'utf8', (e, file) => {
					if (e) return Bot.say(room, 'No games were found to restore.');
					let restore = JSON.parse(file);
					if (!restore) return Bot.say(room, 'No games were found to restore.');
					if (!restore.W.player || !restore.B.player) return Bot.say(room, `Uhh, that one was just in signups. Use \`\`${prefix}othello new force\`\` to make a new one instead!`);
					Bot.rooms[room].othello = new tools.Othello(room, restore);
					let game = Bot.rooms[room].othello;
					Bot.say(room, `The game was restored! ${game[game.turn].name}, your turn!`);
					Bot.say(room, `/adduhtml OTHELLO,${game.display()}<br /><br /><div style="color: ${game.turn === 'W' ? 'white' : 'black'}; background-color: #808080; text-align: center;"><h1>${game[game.turn].name.replace(/</g, '&lt;').replace(/>/g, '&gt;')}'s Turn!</h1></div>`);
				});
				break;
			}
		}
	}
}