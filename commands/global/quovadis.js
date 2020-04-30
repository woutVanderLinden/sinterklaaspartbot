module.exports = {
	cooldown: 100,
	help: `Creates a game of Quo Vadis with the given players. Syntax: ${prefix}quovadis (new/status/rules/play/confirm), (use 'rules' for more information)`,
	permissions: 'none',
	commandFunction: async function (Bot, room, time, by, args, client) {
		if (!args[0]) return Bot.say(room, unxa);
		if (!Bot.rooms[room]) return Bot.pm(by, 'Invalid room.');
		switch (toId(args.shift())) {
			case 'new': case 'create': case 'n': {
				if (!tools.hasPermission(by, 'admin', room)) return Bot.say(room, 'Access denied.');
				if (Bot.rooms[room].quovadis) return Bot.say(room, 'A game of Quo Vadis is currently active.');
				args = args.join(' ').split(/,\s*/);
				if (!args[1] || args[2]) return Bot.say(room, 'Unexpected number of players.');
				Bot.rooms[room].quovadis = {
					host: by.substr(1),
					round: 0,
					phase: 1,
					turn: null,
					played: null,
					p1: {
						id: toId(args[0]),
						name: args[0],
						num: 1,
						points: 99,
						rounds: 0,
						temPlay: null,
						play: null,
						getRange: function () {
							if (this.points > 79) return '80-99';
							if (this.points > 59) return '60-79';
							if (this.points > 39) return '40-59';
							if (this.points > 19) return '20-39';
							return '0-19';
						}
					},
					p2: {
						id: toId(args[1]),
						name: args[1],
						num: 2,
						points: 99,
						rounds: 0,
						temPlay: null,
						play: null,
						getRange: function () {
							if (this.points > 79) return '80-99';
							if (this.points > 59) return '60-79';
							if (this.points > 39) return '40-59';
							if (this.points > 19) return '20-39';
							return '0-19';
						}
					},
					getPlayer: function (name) {
						if (name === 1 || name === 2) return this[`p${name}`];
						let id = toId(name);
						if (this.p1.id == id) return this.p1;
						if (this.p2.id == id) return this.p2;
						return null;
					},
					display: function (play) {
						if (!this.turn || !this.p1.id || !this.p2.id) return 'Something went wrong in displaying the data.';
						return `<B>Turn ${this.turn}<B>`;
					}
				}
				Bot.say(room, `A match of Quo Vadis between ${args[0]} and ${args[1]} is starting!`);
				let qv = Bot.rooms[room].quovadis, fp = qv.getPlayer(Math.floor(1 + Math.random() * 2));
				qv.round = 1;
				qv.turn = fp.id;
				return Bot.say(room, `**Round 1**: The first turn is of **${fp.name}**! Please make your move in my PMs.`);
				break;
			}
			case 'play': {
				let qv = Bot.rooms[room].quovadis;
				if (!qv) return Bot.pm(by, 'Quo Vadis is not currently active in this room.');
				let player = qv.getPlayer(toId(by));
				if (!player) return Bot.pm(by, `You're not a player, sadly.`);
				if (!qv.turn == toId(by)) return Bot.pm(by, 'Not your turn.');
				let points = parseInt(args.join('').replace(/[^0-9]/g, ''));
				if (isNaN(points)) return Bot.pm(by, 'Invalid points.');
				if (points > player.points) return Bot.pm(by, `You don't have that many points left!`);
				Bot.pm(by, `Playing **${points}** point(s). Type \`\`${prefix}confirm\`\` to confirm.`);
				player.temPlay = points;
				Bot.userCallbacks[toId(by)] = function (by, message, room) {
					if (message.toLowerCase() == `${prefix}confirm`) {
						let qv = Bot.rooms[room].quovadis, p = qv.getPlayer(toId(by));
						if (!p) return;
						if (qv.turn !== toId(by)) return Bot.pm(by, 'Not your turn.');
						if (p.temPlay === null) return Bot.pm(by, `You haven't played anything to confirm, yet!`);
						p.points -= (p.play = p.temPlay);
						p.temPlay = null;
						Bot.pm(by, 'Your turn has been played!');
						if (qv.phase == 1) {
							qv.play = p.play;
							let oP = qv.getPlayer(2 - (p.num + 1) % 2);
							qv.turn = oP.id;
							qv.phase = 2;
							Bot.say(room, `${p.name} has played **${p.play > 9 ? 'Double' : 'Single'}**. They are currently in the ${p.getRange()} range. It is now the turn of ${oP.name}.`);
						}
						else if (qv.phase == 2) {
							qv.phase = 1;
							if (p.play > qv.play) {
								p.rounds++;
								Bot.say(room, `${p.name} has played **${p.play > 9 ? 'Double' : 'Single'}** and won the round. They are currently in the ${p.getRange()} range.`);
								if (qv.round++ == 8) Bot.say(room, `The game ended! The final scores were: ${qv.p1.name}: ${qv.p1.rounds} to ${qv.p2.name}: ${qv.p2.rounds}! Thanks for playing!`);
								else Bot.say(room, `**Round ${qv.round}**: The first turn is of **${p.name}**! Please make your move in my PMs.`)
							}
							else if (p.play == qv.play) {
								let oP = qv.getPlayer(2 - (p.num + 1) % 2);
								Bot.say(room, `${p.name} has played **${p.play > 9 ? 'Double' : 'Single'}** and drawn the round. They are currently in the ${p.getRange()} range.`);
								qv.turn = oP.id;
								if (qv.round++ == 8) Bot.say(room, `The game ended! The final scores were: ${qv.p1.name}: ${qv.p1.rounds} to ${qv.p2.name}: ${qv.p2.rounds}! Thanks for playing!`);
								else Bot.say(room, `**Round ${qv.round}**: The first turn is of **${oP.name}**! Please make your move in my PMs.`)
							}
							else if (p.play < qv.play) {
								let oP = qv.getPlayer(2 - (p.num + 1) % 2);
								Bot.say(room, `${p.name} has played **${p.play > 9 ? 'Double' : 'Single'}** and lost the round. They are currently in the ${p.getRange()} range.`);
								qv.turn = oP.id;
								oP.rounds++;
								if (qv.round++ == 8) Bot.say(room, `The game ended! The final scores were: ${qv.p1.name}: ${qv.p1.rounds} to ${qv.p2.name}: ${qv.p2.rounds}! Thanks for playing!`);
								else Bot.say(room, `**Round ${qv.round}**: The first turn is of **${oP.name}**! Please make your move in my PMs.`)
							}
						}
						else return Bot.pm(by, 'This went wrong.');
						return delete Bot.userCallbacks[toId(by)];
					}
				}
				Bot.userCallbackData[toId(by)] = [room];
				break;
			}
			case 'status': {
				//
				break;
			}
			case 'rules': {
				let html = `<DETAILS><SUMMARY>How To Play</SUMMARY><HR>In Quo Vadis, two players face off. Both players have a pool of 99 points. The game has nine rounds, and whichever player wins more rounds wins the game. In each round, each player can choose to play as many points as they would like to from their pool of points. The player who played more points wins the round. The other player will have one piece of information: whether a single or double-digit number of points was played. Apart from this, whenever either player's points dip below 80, 60, 40, and 20 points, both players will be notified. The starter of the first round is chosen randomly; thereafter, the winner of the previous round goes first. </DETAILS>
					<BR>
					<DETAILS><SUMMARY>Commands</SUMMARY><HR>
					${prefix}quovadis new (player 1), (player 2) - Use this command in a chatroom to create a game of Quo Vadis with the given players. Requires staff. <BR>
					${prefix}quovadis play (room), (number of points) - Use this command in PMs when it is your turn to play. <BR>
					${prefix}confirm - Use this command in PMs to confirm your play. <BR>
					${prefix}quovadis status - Displays all public information. <BR>
					${prefix}quovadis sub (player 1), (player 2) - Substitutes Player 1 with Player 2. <BR>
					${prefix}quovadis newhost (host) - Sets Host as the new host. Requires Staff. <BR>
					${prefix}quovadis end - Ends the current game without awarding points. </DETAILS>`;
				if (tools.hasPermission(by, 'gamma', room)) return Bot.say(room, `/addhtmlbox ${html}`);
				else return Bot.say(room, `/pminfobox ${by}, ${html}`);
				break;
			}
		}
	}
}