/*****************************************************
                    OF MAJOR NOTE

PartBot's battle AI is absolutely terrible and will 
often attempt to use the move 'null' if a status move 
is in the moveset. It also doesn't recognize a lot of
moves and mechanics. Contributions and improvements 
are always welcome.

The actual logic is stored in ./data/BATTLE/ai.js

*****************************************************/

exports.handler = function (Bot) {
	Bot.on('battle', (room, message, isIntro, args) => {
		args = Array.from(args);
		let game = BattleAI.games[room];
		switch (args[0]) {
			case 'init': {
				Bot.setAvatar(config.avatar);
				return;
				break;
			}
			case 'request': {
				if (isIntro) break;
				if (args[1]) {
					args.shift();
					try {
						let obj = JSON.parse(args.join('|'));
						if (toId(obj.side.name) !== toId(Bot.status.nickName)) return Bot.say(room, "THIS ISN'T ME AAAA");
						if (!game) game = BattleAI.newGame(room, obj.side);
						//Bot.say(room, '!code ' + JSON.stringify(obj, null, 2));
						if (!game || !game.started) return;
						if (obj.side) game.side = obj.side;
						if (obj.active) game.active = obj.active;
						if (obj.forceSwitch) return Bot.say(room, `/switch ${game.switchPick(true)}`);
						else {
							setTimeout(() => {
								let pick = game.switchPick();
								if (pick && ((obj.active && obj.active[0]) ? !obj.active[0].trapped : true)) return Bot.say(room, `/switch ${pick}`);
								else return Bot.say(room, `/move ${game.pickMove()}`);
							}, 100);
						}
					} catch (e) {
						console.log(e);
					}
				}
				break;
			}
			case 'poke': {
				if (isIntro) break;
				if (game && args[1] !== game.side.id) return game.enemyTeam.push(args[2].split(', ')[0]);
				break;
			}
			case 'tier': {
				if (isIntro) break;
				if (!game) return;
				game.tier = args[1];
				if (game.tier.includes('[Gen 8] Random Battle')) {
					game.started = true;
					return Bot.say(room, "G'luck!");
				}
				break;
			}
			case 'teampreview': {
				if (isIntro) break;
				Bot.say(room, "G'luck!");
				if (!game) break;
				return Bot.say(room, `/team ${game.firstPick()}`);
				break;
			}
			case 'faint': {
				if (isIntro || !game) break;
				if (args[2] && !args[1].startsWith(game.side.id)) return game.enemyTeam.remove(args[2].split(', ')[0]);
				break;
			}
			case '-boost': {
				if (isIntro) break;
				if (!game) return;
				if (args[1].startsWith(game.side.id)) {
					game.selfBoosts[args[2]] += parseInt(args[3]);
				}
				else game.enemyData.boosts[args[2]] += parseInt(args[3]);
				break;
			}
			case '-setboost': {
				if (isIntro) break;
				if (!game) return;
				if (args[1].startsWith(game.side.id)) {
					game.selfBoosts[args[2]] = parseInt(args[3]);
				}
				else game.enemyData.boosts[args[2]] = parseInt(args[3]);
				break;
			}
			case '-unboost': {
				if (isIntro) break;
				if (!game) return;
				if (args[1].startsWith(game.side.id)) {
					game.selfBoosts[args[2]] -= parseInt(args[3]);
				}
				else game.enemyData.boosts[args[2]] -= parseInt(args[3]);
				break;
			}
			case '-miss': {
				if (isIntro) break;
				return Bot.say(room, 'F');
				break;
			}
			case '-crit': {
				if (isIntro) break;
				return Bot.say(room, '>crit');
				break;
			}
			case '-sidestart': {
				if (isIntro) break;
				if (!game) return;
				if (args[1].startsWith(game.side.id)) {
					if (args[2] == 'move: Stealth Rock') game.sideHazards.sr = true;
					else if (args[2] == 'move: Spikes') game.sideHazards.spikes = (game.sideHazards.spikes ? game.sideHazards.spikes + 1 : 1);
					else if (args[2] == 'move: Toxic Spikes') game.sideHazards.tspikes = (game.sideHazards.tspikes ? game.sideHazards.tspikes + 1 : 1);
				}
				else {
					if (args[2] == 'move: Stealth Rock') game.setHazards.sr = true;
					else if (args[2] == 'move: Spikes') game.setHazards.spikes = (game.setHazards.spikes ? game.setHazards.spikes + 1 : 1);
					else if (args[2] == 'move: Toxic Spikes') game.setHazards.tspikes = (game.setHazards.tspikes ? game.setHazards.tspikes + 1 : 1);
				}
				break;
			}
			case '-item': {
				if (isIntro) break;
				if (!game) return;
				if (!args[1].startsWith(game.side.id)) return game.enemyData.item = args[2];
				break;
			}
			case '-enditem': {
				if (isIntro) break;
				if (!game) return;
				if (!args[1].startsWith(game.side.id)) return game.enemyData.item = null;
				break;
			}
			case '-ability': {
				if (isIntro) break;
				if (!game) return;
				if (!args[1].startsWith(game.side.id)) return game.enemyData.ability = args[2];
				break;
			}
			case '-sideend': {
				if (isIntro) break;
				if (!game) return;
				if (args[1].startsWith(game.side.id)) {
					if (args[2] == 'move: Stealth Rock') game.sideHazards.sr = false;
					else if (args[2] == 'move: Spikes') game.sideHazards.spikes = 0;
					else if (args[2] == 'move: Toxic Spikes') game.sideHazards.tspikes = 0;
				}
				else {
					if (args[2] == 'move: Stealth Rock') game.setHazards.sr = false;
					else if (args[2] == 'move: Spikes') game.setHazards.spikes = 0;
					else if (args[2] == 'move: Toxic Spikes') game.setHazards.tspikes = 0;
				}
				break;
			}
			case 'switch': {
				if (isIntro || !game) break;
				if (args[1] && args[1].startsWith(game.side.id)) game.setActiveBoosts();
				else {
					game.enemy = args[2].split(', ')[0];
					game.setEnemyData();
				}
				break;
			}
			case 'win': {
				if (game && toId(args[1]) !== toId(Bot.status.nickName)) Bot.say(room, 'Welp, GG!');
				else if (game) Bot.say(room, 'Well played! GG!');
				else Bot.say(room, 'GG, both!');
				Bot.say(room, '/part')
				if (game) return delete BattleAI.games[room];
				else return;
				break;
			}
			default: return;
		}
	});
}
