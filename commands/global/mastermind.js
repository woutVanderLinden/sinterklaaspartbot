module.exports = {
	cooldown: 1,
	help: `Mastermind, the code-breaking game! Type \`\`${prefix}mastermind new (guess limit, optional)\`\` to make a game, and \`\`${prefix}mastermind guess (your guess; eg 5694)\`\` to make a guess. Rules: https://en.wikipedia.org/wiki/Mastermind_(board_game)`,
	permissions: 'none',
	commandFunction: function (Bot, room, time, by, args, client, pm) {
		if (!tools.canHTML(room)) return Bot.say(room, "Sorry, can't do that here - I need to be a room Bot.");
		if (!args.length) args.push('help');
		switch (toId(args.shift())) {
			case 'help': case 'h': {
				if (tools.hasPermission(by, 'gamma', room) && !pm) return Bot.say(room, this.help);
				else return Bot.pm(by, this.help);
				break;
			}
			case 'new': case 'n': {
				if (!Bot.rooms[room].mastermind) Bot.rooms[room].mastermind = {};
				let mm = Bot.rooms[room].mastermind;
				const user = toId(by);
				if (mm[user]) return Bot.pm(by, `You're already playing one! If you want to end the current one, do \`\`${prefix}mastermind end\`\`.`);
				if (pm) return Bot.pm(by, "Can't start one from PMs. o.o");
				let limit;
				if (args.length) limit = parseInt(args);
				if (limit && !(limit < 13 && limit > 4)) {
					Bot.pm(by, "Invalid limit; limit has been set to 10.");
					limit = 10;
				}
				if (!limit) limit = 10;
				mm[user] = new tools.Mastermind(room, by, limit);
				Bot.say(room, `${by.substr(1)} is playing a round of Mastermind! Type \`\`${prefix}mastermind spectate ${by.substr(1)}\`\` to watch!`);
				mm[user].sendPages();
				return
				break;
			}
			case 'guess': case 'g': case 'play': case 'p': {
				if (!Bot.rooms[room].mastermind) return Bot.pm(by, "No games are active.");
				let mm = Bot.rooms[room].mastermind;
				user = toId(by);
				if (!mm[user]) return Bot.pm(by, "You're not playing...");
				if (!args.length) return Bot.pm(by, unxa);
				let guess = args.join('').replace(/[^0-7]/g, '');
				if (guess.length !== 4) return Bot.pm(by, "Invalid guess - your guess must contain four valid numbers from 0-7.");
				return mm[user].guess(guess).then(end => {
					switch (end) {
						case 0: {
							return mm[user].sendPages();
							break;
						}
						case 1: {
							Bot.say(room, `${by.substr(1)} successfully cracked ${mm[user].sol.join('')} in ${mm[user].guesses.length} tries!`);
							mm[user].sendPages();
							return delete mm[user];
							break;
						}
						case 2: {
							Bot.say(room, `${by.substr(1)} was unable to crack ${mm[user].sol.join('')} in ${mm[user].guesses.length} tries. ;-;`);
							mm[user].sendPages();
							return delete mm[user];
							break;
						}
					}
				}).catch(err => {
					Bot.log(err);
					Bot.pm(by, err);
				});
				break;
			}
			case 'spectate': case 's': case 'watch': case 'w': {
				if (!Bot.rooms[room].mastermind) return Bot.pm(by, "No games are active.");
				let mm = Bot.rooms[room].mastermind;
				user = toId(by);
				let input;
				if (!Object.keys(mm).length) return Bot.pm(by, "NOBODY. NOBODY AT ALL.");
				if (Object.keys(mm).length === 1) input = Object.keys(mm)[0];
				if (args.length) input = toId(args.join(''));
				if (!mm[input]) return Bot.pm(by, `Sorry, didn't find ${input ? `${input}'s` : 'a'} game.`);
				if (mm[input].spectators.includes(user)) return Bot.pm(by, "You're already spectating them - use rejoin to rejoin if you accidentally closed it, or unspectate to stop spectating.");
				if (mm[input].player === user) return Bot.pm(by, "Mirror, mirror, on the wall - who's the nerdiest of 'em all?");
				mm[input].spectators.push(user);
				Bot.pm(by, `You're now spectating ${mm[input].name}'s game of Mastermind!`);
				Bot.say(room, `/sendhtmlpage ${user}, Mastermind + ${room} + ${input},${mm[input].boardHTML()}`);
				break;
			}
			case 'unspectate': case 'us': case 'unwatch': case 'uw': case 'u': {
				if (!Bot.rooms[room].mastermind) return Bot.pm(by, "No games are active.");
				let mm = Bot.rooms[room].mastermind;
				user = toId(by);
				let input;
				if (!Object.keys(mm).length) return Bot.pm(by, "NOBODY. NOBODY AT ALL.");
				let games = Object.values(mm).filter(game => game.spectators.includes(user));
				if (games.length === 1) input = games[0].player;
				if (args.length) input = toId(args.join(''));
				if (!mm[input]) return Bot.pm(by, `Sorry, didn't find ${input}'s game.`);
				if (!mm[input].spectators.includes(user)) return Bot.pm(by, "You arne't spectating them - use the spectate option to spectate.");
				if (mm[input].player === user) return Bot.pm(by, "Mirror, mirror, on the wall - who's the nerdiest of 'em all?");
				mm[input].spectators.remove(user);
				Bot.pm(by, `You are no longer spectating ${mm[input].name}'s game of Mastermind. ;-;`);
				break;
			}
			case 'rejoin': case 'rj': {
				if (!Bot.rooms[room].mastermind) return Bot.pm(by, "No games are active.");
				let mm = Bot.rooms[room].mastermind;
				user = toId(by);
				if (!mm[user]) return Bot.pm(by, "You're not playing...");
				let users = [];
				Object.values(mm).forEach(game => {
					if (game.spectators.includes(user) || game.player === user) users.push(game.player);
				});
				users.forEach(game => Bot.say(room, `/sendhtmlpage ${user}, Mastermind + ${room} + ${game},${mm[game].boardHTML()}`));
				break;
			}
			case 'forfeit': case 'ff': case 'f': case 'resign': case 'r': case 'end': case 'e': {
				if (!Bot.rooms[room].mastermind) return Bot.pm(by, "No games are active.");
				let mm = Bot.rooms[room].mastermind; user = toId(by);
				if (!mm[user]) return Bot.pm(by, "You're not playing...");
				Bot.say(room, `${by.substr(1)} was unable to crack ${mm[user].sol.join('')} in ${mm[user].guesses.length} tries. ;-;`);
				return delete mm[user];
				break;
			}
			case 'type': case 't': {
				if (!Bot.rooms[room].mastermind) return Bot.pm(by, "No games are active.");
				let mm = Bot.rooms[room].mastermind;
				user = toId(by);
				if (!mm[user]) return Bot.pm(by, "You're not playing...");
				if (!args.length) return Bot.pm(by, unxa);
				let guess = args.join('').replace(/[^0-7]/g, '');
				if (guess.length !== 1) return Bot.pm(by, "Invalid - your message must contain exactly one valid number from 0-7.");
				if (!mm[user].type(...guess)) {
					Bot.log(mm[user]);
					return Bot.pm(by, "Something went wrong!");
				}
				return mm[user].sendPages();
				break;
			}
			case 'backspace': case 'b': {
				if (!Bot.rooms[room].mastermind) return Bot.pm(by, "No games are active.");
				let mm = Bot.rooms[room].mastermind;
				user = toId(by);
				if (!mm[user]) return Bot.pm(by, "You're not playing...");
				if (mm[user].backspace()) mm[user].sendPages();
				return;
				break;
			}
			default: {
				Bot.pm(by, "Sorry, I don't get what you want me to do. Take a candy instead.");
			}
		}
	}
}
