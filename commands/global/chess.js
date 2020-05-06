module.exports = {
	cooldown: 1,
	help: `The Chess module. Use \`\`new\`\` to make a new game, \`\`join (colour)\`\` to join, and \`\`play (id) (position)-(position)\`\` to play.`,
	permissions: 'none',
	commandFunction: function (Bot, room, time, by, args, client) {
		if (!args[0]) args.push('help');
		switch (args[0].toLowerCase()) {
			case 'help': case 'h': {
				return Bot.say(room, `PartBot\'s Chess module: Use ${prefix}chess play (game ID) (original position)-(final position) to play a move. Alternatively, you can click on the interactive UHTML screen.`);
				break;
			}
			case 'new': case 'n': {
				if (!tools.hasPermission(by, 'gamma', room)) return Bot.say(room, 'Access denied.');
				if (Bot.rooms[room].chess) return Bot.say(room, 'A game is already active.');
				fs.readFile(`./data/BACKUPS/chess-${room}.json`, 'utf8', (err, file) => {
					if (err) file = null;
					if (file && args[1] && !['force', 'confirm', 'f'].includes(args[1].toLowerCase())) return Bot.say(room, `A backup for an interrupted game was found. Use \`\`${prefix}chess new force\`\` to create a new game, or \`\`${prefix}chess restore\`\` to restore it!`);
					else if (file) fs.unlink(`./data/BACKUPS/chess-${room}.json`, e => {});
					Bot.rooms[room].chess = new tools.Chess(room);
					Bot.say(room, `/adduhtml CHESS, <H1>Signups have begun!</H1><BUTTON name="send" value="${prefix}chess join White">White</BUTTON><BUTTON name="send" value="${prefix}chess join Black">Black</BUTTON>`);
				});
				return;
				break;
			}
			case 'join': case 'j': {
				if (!Bot.rooms[room].chess) return Bot.say(room, 'There isn\'t an active chess game in this room.');
				if (!args[1]) return Bot.say(room, 'Please specify the side.');
				let game = Bot.rooms[room].chess;
				switch (args[1][0].toLowerCase()) {
					case 'w': {
						if (game.W.player) return Bot.pm(by, "Sorry, White's already taken!");
						game.W.player = toId(by);
						game.W.name = by.substr(1);
						if (!game.B.player) return Bot.say(room, `/adduhtml CHESS, <H1>Signups have begun!</H1><BUTTON name="send" value="${prefix}chess join Black">Black</BUTTON>`);
						else {							
							if (game.B.player === game.W.player) {
								game.B.player = null;
								game.B.name = null;
								return Bot.pm(by, 'Nope, not allowed to fight yourself.');
							}
							Bot.say(room, `The match between ${game.W.name} and ${game.B.name} is starting!`);
							game.setBoard();
							return Bot.say(room, `/adduhtml CHESS,${game.boardHTML(game.turn)}`);
						}
					}
					case 'b': {
						if (game.B.player) return Bot.pm(by, "Sorry, Black's already taken!");
						game.B.player = toId(by);
						game.B.name = by.substr(1);
						if (!game.W.player) return Bot.say(room, `/adduhtml CHESS, <H1>Signups have begun!</H1><BUTTON name="send" value="${prefix}chess join White">White</BUTTON>`);
						else {
							if (game.B.player === game.W.player) {
								game.B.player = null;
								game.B.name = null;
								return Bot.pm(by, 'Nope, not allowed to fight yourself.');
							}
							Bot.say(room, `The match between ${game.W.name} and ${game.B.name} is starting!`);
							game.setBoard();
							return Bot.say(room, `/adduhtml CHESS,${game.boardHTML(game.turn)}`);
						}
					}
					default: return Bot.pm(by, 'Whoa, that\'s not a valid colour.')
				}
				break;
			}
			case 'play': {
				if (!Bot.rooms[room].chess) return Bot.pm(by, 'There isn\'t an active chess game in this room.');
				if (!args[1]) return Bot.pm(by, unxa);
				args.shift();
				let game = Bot.rooms[room].chess;
				if (!(game[game.turn].player === toId(by))) return;
				let squares = args.join('').toLowerCase().split('-');
				game.play(game.turn, squares[0], squares[1], (run, info) => {
					if (!run) return Bot.pm(by, info);
					if (run === 1) {
						Bot.say(room, `/adduhtml CHESS,${game.boardHTML(game.turn)}`);
						Bot.pm(game[game.turn].name, 'Your turn!');
					}
					else if (run === 2) {
						Bot.say(room, `/adduhtml CHESS,${game.boardHTML(game.turn)}<BR/><CENTER><B>Promotion time!</B><BR/><BUTTON name="send" value="/w ${Bot.status.nickName}, ${prefix}chess ${room} promote ${info} Queen">Queen</BUTTON> <BUTTON name="send" value="/w ${Bot.status.nickName}, ${prefix}chess ${room} promote ${info} Rook">Rook</BUTTON> <BUTTON name="send" value="/w ${Bot.status.nickName}, ${prefix}chess ${room} promote ${info} Bishop">Bishop</BUTTON> <BUTTON name="send" value="/w ${Bot.status.nickName}, ${prefix}chess ${room} promote ${info} Knight">Knight</BUTTON></CENTER>`);
						Bot.pm(game[game.turn].name, 'Your turn!');
					}
					else if (run === 3) {
						let moves = Bot.rooms[room].chess.moves;
						if (!moves) moves = [];
						delete Bot.rooms[room].chess;
						fs.unlink(`./data/BACKUPS/chess-${room}.json`, e => {});
						Bot.say(room, `/adduhtml CHESS,${game.boardHTML(game.turn)}`);
						Bot.say(room, 'Checkmate! Game ended!');
						tools.uploadToHastebin(moves.map((m, i) => (i % 2 ? '' : `${Math.floor(i / 2) + 1}.\t${Array.from({length: 7 - m.length}).fill('').join(' ')}`) + m + (i % 2 ? '\n' : '   -   ')).join(''), url => Bot.say(room, `Game logs: ${url}`));
						return;
					}
					else if (run === 4) {
						let moves = Bot.rooms[room].chess.moves;
						if (!moves) moves = [];
						delete Bot.rooms[room].chess;
						fs.unlink(`./data/BACKUPS/chess-${room}.json`, e => {});
						Bot.say(room, `/adduhtml CHESS,${game.boardHTML(game.turn)}`);
						Bot.say(room, 'Stalemate! Game ended!');
						tools.uploadToHastebin(moves.map((m, i) => (i % 2 ? '' : `${Math.floor(i / 2) + 1}.\t${Array.from({length: 7 - m.length}).fill('').join(' ')}`) + m + (i % 2 ? '\n' : '   -   ')).join(''), url => Bot.say(room, `Game logs: ${url}`));
						return;
					}
					fs.writeFile(`./data/BACKUPS/chess-${room}.json`, JSON.stringify(Bot.rooms[room].chess), e => {
						if (e) console.log(e);
					});
				});
				break;
			}
			case 'select': {
				if (!Bot.rooms[room].chess) return Bot.pm(by, 'This room does not have any chess games.');
				if (!args[1]) return Bot.say(room, unxa);
				args.shift();
				let game = Bot.rooms[room].chess;
				if (!(game[game.turn].player === toId(by))) return;
				let square = args.join('').toLowerCase();
				let text = game.boardHTML(game.turn, square, game.getValidMoves(square));
				if (!text) return;
				return Bot.say(room, `/adduhtml CHESS,${text}`);
				break;
			}
			case 'deselect': {
				if (!Bot.rooms[room].chess) return Bot.pm(by, 'This room does not have any chess games.');
				let game = Bot.rooms[room].chess;
				if (!(game[game.turn].player === toId(by))) return;
				return Bot.say(room, `/adduhtml CHESS,${game.boardHTML(game.turn)}`);
				break;
			}
			case 'promote': {
				if (!Bot.rooms[room].chess) return Bot.pm(by, 'This room does not have any chess games.');
				let game = Bot.rooms[room].chess;
				if (!(game[game.turn].player === toId(by))) return;
				if (!args[1] || !args[2]) return Bot.pm(by, unxa);
				args = args.map(arg => arg.toLowerCase());
				if (!/^[a-h][1-8]$/.test(args[1])) return Bot.pm(by, 'Invalid square! (You shouldn\'t be seeing this if you used the buttons)');
				let piece;
				switch (args[2]) {
					case 'knight': case 'n': piece = 'N'; break;
					case 'bishop': case 'b': piece = 'B'; break;
					case 'rook': case 'r': piece = 'R'; break;
					case 'queen': case 'q': piece = 'Q'; break;
					default: break;
				}
				if (!piece) return Bot.pm(by, 'Invalid piece!');
				if (!game[game.turn].isPromoting) return Bot.pm(by, `You're not promoting anything.`);
				game.promote(piece, args[1], game.turn, (run, info) => {
					if (!run) return Bot.pm(by, info);
					if (run === 1) {
						Bot.say(room, `/adduhtml CHESS,${game.boardHTML(game.turn)}`);
						Bot.pm(game[game.turn].name, 'Your turn!');
					}
					else if (run === 2) {
						Bot.say(room, `SOMETHING IS VERY WRONG.`);
					}
					else if (run === 3) {
						let moves = Bot.rooms[room].chess.moves;
						if (!moves) moves = [];
						delete Bot.rooms[room].chess;
						fs.unlink(`./data/BACKUPS/chess-${room}.json`, e => {});
						Bot.say(room, `/adduhtml CHESS,${game.boardHTML(game.turn)}`);
						Bot.say(room, 'Checkmate! Game ended!');
						tools.uploadToHastebin(moves.map((m, i) => (i % 2 ? '' : `${Math.floor(i / 2) + 1}.\t${Array.from({length: 7 - m.length}).fill('').join(' ')}`) + m + (i % 2 ? '\n' : '   -   ')).join(''), url => Bot.say(room, `Game logs: ${url}`));
						return;
					}
					else if (run === 4) {
						let moves = Bot.rooms[room].chess.moves;
						if (!moves) moves = [];
						delete Bot.rooms[room].chess;
						fs.unlink(`./data/BACKUPS/chess-${room}.json`, e => {});
						Bot.say(room, `/adduhtml CHESS,${game.boardHTML(game.turn)}`);
						Bot.say(room, 'Stalemate! Game ended!');
						tools.uploadToHastebin(moves.map((m, i) => (i % 2 ? '' : `${Math.floor(i / 2) + 1}.\t${Array.from({length: 7 - m.length}).fill('').join(' ')}`) + m + (i % 2 ? '\n' : '   -   ')).join(''), url => Bot.say(room, `Game logs: ${url}`));
						return;
					}
					fs.writeFile(`./data/BACKUPS/chess-${room}.json`, JSON.stringify(Bot.rooms[room].chess), e => {
						if (e) console.log(e);
					});
				});
				break;
			}
			case 'substitute': case 'sub': {
				if (!Bot.rooms[room].chess) return Bot.pm(by, 'This room does not have any chess games.');
				let game = Bot.rooms[room].chess;
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
			case 'end': case 'e': {
				if (!Bot.rooms[room].chess) return Bot.pm(by, 'This room does not have any chess games.');
				let game = Bot.rooms[room].chess;
				if (!tools.hasPermission(by, 'gamma', room)) return Bot.pm(by, 'Access denied.');
				let moves = Bot.rooms[room].chess.moves;
				if (!moves) moves = [];
				moves.push('END');
				delete Bot.rooms[room].chess;
				fs.unlink(`./data/BACKUPS/chess-${room}.json`, e => {});
				Bot.say(room, 'Game ended!');
				tools.uploadToHastebin(moves.map((m, i) => (i % 2 ? '' : `${Math.floor(i / 2) + 1}.\t${Array.from({length: 7 - m.length}).fill('').join(' ')}`) + m + (i % 2 ? '\n' : '   -   ')).join(''), url => Bot.say(room, `Game logs: ${url}`));
				break;
			}
			case 'restore': case 'resume': case 'r': {
				if (!tools.hasPermission(by, 'gamma', room)) return Bot.pm(by, 'Access denied.');
				fs.readFile(`./data/BACKUPS/chess-${room}.json`, 'utf8', (e, file) => {
					if (e) return Bot.say(room, 'No games were found to restore.');
					let restore = JSON.parse(file);
					if (!restore) return Bot.say(room, 'No games were found to restore.');
					if (!restore.W.player || !restore.B.player) return Bot.say(room, `Uhh, that one was just in signups. Use \`\`${prefix}chess new force\`\` to make a new one instead!`);
					Bot.rooms[room].chess = new tools.Chess(room, restore);
					let game = Bot.rooms[room].chess;
					Bot.say(room, `The game was restored! ${game[game.turn].name}, your turn!`);
					Bot.say(room, `/adduhtml CHESS,${game.boardHTML(game.turn)}`);
				});
				break;
			}
			case 'board': {
				let  game = Bot.rooms[room].chess;
				if (!game) return Bot.pm(by, 'No games are active here...');
				Bot.sendHTML(by, game.boardHTML('W'));
				break;
			}
			default: {
				Bot.pm(by, `That, uhh, doesn't seem to be something I recognize?`);
				break;
			}
		}
	}
}
