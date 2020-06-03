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
				if (Bot.rooms[room].CR) return Bot.pm(by, 'One\'s going on.');
				if (!tools.hasPermission(by, 'beta', room)) return Bot.pm(by, 'Access denied.');
				Bot.rooms[room].CR = new tools.CR(9, 6, room);
				Bot.say(room, `A game of Chain Reaction has been created! Use \`\`${prefix}chainreaction join\`\` to join!`);
				break;
			}
			case 'start': case 's': {
				if (!Bot.rooms[room].CR) return Bot.pm(by, 'Nope, no Chain Reaction here.');
				if (!tools.hasPermission(by, 'beta', room)) return Bot.pm(by, 'Access denied.');
				if (Bot.rooms[room].CR.started) return Bot.pm(by, 'F in being too late.');
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
				if (!boards || !boards.length) return Bot.pm(by, 'Just click the board, nerd.');
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
		}
	}
}
