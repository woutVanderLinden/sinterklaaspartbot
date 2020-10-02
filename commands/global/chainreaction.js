module.exports = {
	cooldown: 1,
	help: `https://brilliant.org/wiki/chain-reaction-game/`,
	permissions: 'none',
	commandFunction: function (Bot, room, time, by, args, client) {
		if (!args.length) args.push('help');
		switch (toId(args.shift())) {
			case 'help': case 'h': {
				return Bot.say(room, 'https://brilliant.org/wiki/chain-reaction-game/');
				break;
			}
			case 'join': case 'j': {
				if (!Bot.rooms[room].CR) return Bot.pm(by, 'Nope, no Chain Reaction here.');
				if (Bot.rooms[room].CR.started) return Bot.pm(by, 'F in being too late.');
				let pls = Object.keys(Bot.rooms[room].CR.players), game = Bot.rooms[room].CR;
				if (pls > 8 || pls >= game.height * game.width) return Bot.pm(by, "Sorry, hit the player cap. ;-;");
				if (Bot.rooms[room].CR.addPlayer(by.substr(1))) return Bot.say(room, `${by.substr(1)} joined the game!`);
				return Bot.pm(by, "You're already in it. o.o");
				break;
			}
			case 'leave': case 'l': {
				if (!Bot.rooms[room].CR) return Bot.pm(by, 'Nope, no Chain Reaction here.');
				if (Bot.rooms[room].CR.started) return Bot.pm(by, 'F in being too late.');
				if (Bot.rooms[room].CR.removePlayer(by.substr(1))) return Bot.say(room, `${by.substr(1)} left the game!`);
				return Bot.pm(by, "Join first, nerd.");
				break;
			}
			case 'new': case 'n': {
				if (!tools.hasPermission(by, 'gamma', room)) return Bot.pm(by, "Access denied.");
				if (Bot.rooms[room].CR) return Bot.pm(by, 'One\'s going on.');
				if (!(['boardgames'].includes(room) && tools.hasPermission(by, 'gamma', room)) && !tools.hasPermission(by, 'beta', room)) return Bot.pm(by, 'Access denied.');
				let dimensions = [9, 6];
				args = args.join('').split(/[,x]/);
				if (args.length) { 
					args = args.map(t => parseInt(t));
					if (args.length === 2 && !isNaN(args[0]) && !isNaN(args[1])) {
						if (args[0] > 15 || args[0] < 1);
						else if (args[1] > 15 || args[1] < 1);
						else if (args[0] * args[1] < 5);
						else {
							dimensions = args;
						}
					}
				}
				Bot.rooms[room].CR = new tools.CR(...dimensions, room);
				Bot.say(room, `A game of Chain Reaction has been created! Use \`\`${prefix}chainreaction join\`\` to join!`);
				break;
			}
			case 'start': case 's': {
				if (!Bot.rooms[room].CR) return Bot.pm(by, 'Nope, no Chain Reaction here.');
				if (!(['boardgames'].includes(room) && tools.hasPermission(by, 'gamma', room)) && !tools.hasPermission(by, 'beta', room)) return Bot.pm(by, 'Access denied.');
				if (Bot.rooms[room].CR.started) return Bot.pm(by, 'F in being too late.');
				if (Object.keys(Bot.rooms[room].CR.players).length < 2) return Bot.say(room, "Not enough players. ;-;");
				Bot.rooms[room].CR.start();
				break;
			}
			case 'click': {
				let CR = Bot.rooms[room].CR;
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
				if (!Bot.rooms[room].CR) return Bot.say(room, "Didn't have one active anyways.");
				delete Bot.rooms[room].CR;
				Bot.say(room, "Game ended!");
				break;
			}
			case 'sub': {
				if (!(['boardgames'].includes(room) && tools.hasPermission(by, 'gamma', room)) && !tools.hasPermission(by, 'beta', room)) return Bot.pm(by, 'Access denied.');
				if (!Bot.rooms[room].CR) return Bot.say(room, "Don't have a game active.");
				args = args.join(' ').split(/\s*,\s*/);
				if (args.length !== 2) return Bot.say(room, unxa);
				let CR = Bot.rooms[room].CR;
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
				Bot.say(room, `[[ ]]${going} has been subbed with ${coming}!`);
				break;
			}
		}
	}
}
