module.exports = {
	cooldown: 1,
	help: `https://brilliant.org/wiki/chain-reaction-game/`,
	permissions: 'none',
	commandFunction: function (Bot, room, time, by, args, client, isPM) {
		if (!args.length) args.push('help');
		switch (toId(args.shift())) {
			case 'help': case 'h': {
				if (isPM) return Bot.pm(by, this.help);
				return Bot.say(room, this.help);
				break;
			}
			case 'join': case 'j': {
				if (!Bot.rooms[room].chainreaction) return Bot.pm(by, 'Nope, no Chain Reaction here.');
				if (Bot.rooms[room].chainreaction.started) return Bot.pm(by, 'F in being too late.');
				let pls = Object.keys(Bot.rooms[room].chainreaction.players), game = Bot.rooms[room].chainreaction;
				if (pls > 8 || pls >= game.height * game.width) return Bot.pm(by, "Sorry, hit the player cap. ;-;");
				if (Bot.rooms[room].chainreaction.addPlayer(by.substr(1))) return Bot.say(room, `${by.substr(1)} joined the game!`);
				return Bot.pm(by, "You're already in it. o.o");
				break;
			}
			case 'leave': case 'l': {
				if (!Bot.rooms[room].chainreaction) return Bot.pm(by, 'Nope, no Chain Reaction here.');
				if (Bot.rooms[room].chainreaction.started) return Bot.pm(by, 'F in being too late.');
				if (Bot.rooms[room].chainreaction.removePlayer(by.substr(1))) return Bot.say(room, `${by.substr(1)} left the game!`);
				return Bot.pm(by, "Join first, nerd.");
				break;
			}
			case 'new': case 'n': {
				if (isPM) return Bot.pm(by, "Games can only be created in chat.");
				if (!tools.hasPermission(by, 'gamma', room)) return Bot.pm(by, "Access denied.");
				if (Bot.rooms[room].chainreaction) return Bot.pm(by, 'One\'s going on.');
				if (!(['boardgames'].includes(room) && tools.hasPermission(by, 'gamma', room)) && !tools.hasPermission(by, 'beta', room)) return Bot.pm(by, 'Access denied.');
				let dimensions = [9, 6];
				args = args.join(' ').split(/[ ,x]/);
				if (args.length) { 
					args = args.map(t => parseInt(t));
					if (args.length === 2 && !isNaN(args[0]) && !isNaN(args[1])) {
						if (args[0] > 15 || args[0] < 1 || args[1] > 15 || args[1] < 1) return Bot.say(room, "Not a good board size.");
						else if (args[0] * args[1] < 5) return Bot.say(room, "Board too smol.");
						else dimensions = args;
					}
				}
				Bot.rooms[room].chainreaction = GAMES.create('chainreaction', ...dimensions, room);
				Bot.say(room, `A game of Chain Reaction has been created! Use \`\`${prefix}chainreaction join\`\` to join!`);
				break;
			}
			case 'start': case 's': {
				if (!Bot.rooms[room].chainreaction) return Bot.pm(by, 'Nope, no Chain Reaction here.');
				if (!(['boardgames'].includes(room) && tools.hasPermission(by, 'gamma', room)) && !tools.hasPermission(by, 'beta', room)) return Bot.pm(by, 'Access denied.');
				if (Bot.rooms[room].chainreaction.started) return Bot.pm(by, 'F in being too late.');
				if (Object.keys(Bot.rooms[room].chainreaction.players).length < 2) return Bot.say(room, "Not enough players. ;-;");
				Bot.rooms[room].chainreaction.start();
				break;
			}
			case 'click': {
				let CR = Bot.rooms[room].chainreaction;
				if (!CR) return Bot.pm(by, 'Nope, no Chain Reaction here.');
				if (!CR.started) return Bot.pm(by, 'Not started. -_-');
				if (!args.length == 2) return Bot.pm(by, unxa);
				if (CR.turn !== toId(by) || CR.displaying) return;
				let boards = CR.tap(parseInt(args.shift()), parseInt(args.shift()), CR.players[toId(by)].col);
				if (!boards || !boards.length) return Bot.pm(by, 'Just click an empty spot or your own colour, nerd.');
				new Promise ((resolve, reject) => {
					function displayQueue () {
						if (!boards.length) return resolve();
						Bot.say(room, `/adduhtml CR, ${boards.shift()}`);
						setTimeout(displayQueue, 1000);
					}
					CR.displaying = true;
					displayQueue();
				}).then(() => {
					CR.displaying = false;
					CR.nextTurn();
				});
				break;
			}
			case 'end': case 'e': {
				if (!(['boardgames'].includes(room) && tools.hasPermission(by, 'gamma', room)) && !tools.hasPermission(by, 'beta', room)) return Bot.pm(by, 'Access denied.');
				let CR = Bot.rooms[room].chainreaction;
				if (!CR) return Bot.say(room, "Didn't have one active anyways.");
				delete Bot.rooms[room].chainreaction;
				Bot.say(room, "Game ended!");
				break;
			}
			case 'disqualify': case 'dq': case 'modkill': case 'mk': {
				if (!(['boardgames'].includes(room) && tools.hasPermission(by, 'gamma', room)) && !tools.hasPermission(by, 'beta', room)) return Bot.pm(by, 'Access denied.');
				if (isPM) return Bot.pm(by, "Do it in chat, onegai");
				let CR = Bot.rooms[room].chainreaction;
				if (!CR) return Bot.say(room, "Didn't have one active anyways.");
				let user = toId(args.join(''));
				if (!CR.PL.includes(user)) return Bot.say(room, "That user is not in the game.");
				if (!CR.order.includes(user)) return Bot.say(room, "That user is already eliminated. 'o.o");
				if (CR.turn === user) CR.nextTurn();
				CR.order.remove(user);
				Bot.say(room, `${CR.players[user].name} has been disqualified.`);
				if (CR.order.length < 2) return CR.end();
				return;
				break;
			}
			case 'board': case 'b': {
				if (!Bot.rooms[room].chainreaction) return Bot.pm(by, "C-can't find one. ;-;");
				if (!tools.hasPermission(by, 'gamma', room)) return Bot.sendHTML(by, Bot.rooms[room].chainreaction.display());
				Bot.say(room, "/adduhtml CR, " + Bot.rooms[room].chainreaction.display());
				break;
			}
			case 'pl': case 'playerlist': case 'players': case 'order': case 'o': case 'turnorder': case 'to': {
				let CR = Bot.rooms[room].chainreaction;
				if (!CR) return Bot.pm(by, "Players of a non-existent game, surprisingly, do not exist.");
				let html = "<hr/>" + CR.order.map(u => CR.players[u]).map(u => `<b style="color:${u.col};">${u.name.replace(/</g, '&lt;')}</b>`).join(', ') + "<hr/>";
				if (tools.hasPermission(by, 'gamma', room)) Bot.say(room, `/adduhtml CRPLAYERS,${html}`);
				else Bot.sendHTML(by, html);
				break;
			}
			case 'sub': {
				if (!(['boardgames'].includes(room) && tools.hasPermission(by, 'gamma', room)) && !tools.hasPermission(by, 'beta', room)) return Bot.pm(by, 'Access denied.');
				if (isPM) return Bot.pm(by, "Say it in chat you coward");
				if (!Bot.rooms[room].chainreaction) return Bot.say(room, "Don't have a game active.");
				args = args.join(' ').split(/\s*,\s*/);
				if (args.length !== 2) return Bot.say(room, unxa);
				let CR = Bot.rooms[room].chainreaction;
				let ids = args.map(toId);
				if (Object.keys(CR.players).includes(ids[0]) && Object.keys(CR.players).includes(ids[1])) return Bot.say(room, 'The one you\'re subbing in is already a player!');
				if (!Object.keys(CR.players).includes(ids[0]) && !Object.keys(CR.players).includes(ids[1])) return Bot.say(room, "Neither of those are in the game.");
				let going = Object.keys(CR.players).includes(ids[1]) ? args[1] : args[0], coming = Object.keys(CR.players).includes(ids[1]) ? args[0] : args[1];
				if (coming === toId(Bot.status.nickName)) return Bot.say(room, 'NO U');
				CR.players[toId(coming)] = Object.assign({}, CR.players[toId(going)]);
				CR.players[toId(coming)].name = coming;
				delete CR.players[toId(going)];
				CR.order = CR.order.map(id => id === toId(going) ? toId(coming) : id);
				CR.PL = CR.PL.map(id => id === toId(going) ? toId(coming) : id);
				if (CR.turn === toId(going)) CR.turn = toId(coming);
				Object.keys(CR.colours).forEach(col => {
					if (CR.colours[col] === toId(going)) CR.colours[col] = toId(coming);
				});
				Bot.say(room, `/adduhtml CR, ${CR.display()}`);
				Bot.say(room, `[[ ]]${going} has been subbed with ${coming}!`);
				break;
			}
		}
	}
}