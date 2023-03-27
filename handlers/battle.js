// TODO: Have various handlers for custom responses

exports.handler = function (room, message, isIntro, args) {
	args = Array.from(args);
	let game = BattleAI.games[room];

	switch (args[0]) {
		case 'request': {
			if (isIntro) break;
			if (args[1]) {
				args.shift();
				try {
					let obj = JSON.parse(args.join('|')), temp;
					if (!game && !obj.selfPassed) temp = args.join('|');
					if (game?.temp && obj.selfPassed) {
						obj = JSON.parse(game.temp);
						delete game.temp;
					}
					if (toID(obj.side.name) !== toID(Bot.status.nickName)) return Bot.say(room, `THIS ISN'T ME AAAA`);
					Bot.say(room, `/timer on`);
					if (!game) game = BattleAI.newGame(room, obj.side);
					if (temp) game.temp = temp;
					// Bot.say(room, '!code ' + JSON.stringify(obj, null, 2));
					if (!game.started) {
						if (room.startsWith('battle-gen8metronomebattle-')) {
							game.started = true;
							game.tier = '[Gen 8] Metronome Battle';
							Bot.say(room, `G'luck!`);
							game.noSwitch = true;
						} else return;
					}
					if (obj.side) game.side = obj.side;
					if (obj.active) game.active = obj.active;
					if (game.tier === '[Gen 8] Metronome Battle') return Bot.say(room, `/choose move 1,move 1`);
					if (obj.forceSwitch) return Bot.say(room, `/choose switch ${game.switchPick(true)}`);
					else {
						setTimeout(() => {
							const pick = game.switchPick();
							if (pick && (obj.active && obj.active[0] ? !obj.active[0].trapped : true)) {
								return Bot.say(room, `/switch ${pick}`);
							} else return Bot.say(room, `/move ${game.pickMove()}`);
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
			Bot.say(room, `G'luck!`);
			game.tier = args[1];
			if (['[Gen 8] Random Battle', '[Gen 8] Super Staff Bros 4 (Wii U)'].includes(game.tier)) {
				if (game.tier === '[Gen 8] Super Staff Bros 4 (Wii U)') {
					game.ai = 0;
					game.noSwitch = true;
				}
				game.started = true;
				Bot.emit('battle', room, ``, false, ['request', '{ "selfPassed": true }']);
			}
			break;
		}
		case 'teampreview': {
			if (isIntro) break;
			if (!game) break;
			return Bot.say(room, `/team ${game.firstPick()}`);
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
			} else game.enemyData.boosts[args[2]] += parseInt(args[3]);
			break;
		}
		case '-setboost': {
			if (isIntro) break;
			if (!game) return;
			if (args[1].startsWith(game.side.id)) {
				game.selfBoosts[args[2]] = parseInt(args[3]);
			} else game.enemyData.boosts[args[2]] = parseInt(args[3]);
			break;
		}
		case '-unboost': {
			if (isIntro) break;
			if (!game) return;
			if (args[1].startsWith(game.side.id)) {
				game.selfBoosts[args[2]] -= parseInt(args[3]);
			} else game.enemyData.boosts[args[2]] -= parseInt(args[3]);
			break;
		}
		case '-miss': {
			if (isIntro) break;
			return Bot.say(room, 'F');
		}
		case '-crit': {
			if (isIntro) break;
			return Bot.say(room, '>crit');
		}
		case '-sidestart': {
			if (isIntro) break;
			if (!game) return;
			if (args[1].startsWith(game.side.id)) {
				if (args[2] === 'move: Stealth Rock') {
					game.sideHazards.sr = true;
				} else if (args[2] === 'move: Spikes') {
					game.sideHazards.spikes = game.sideHazards.spikes ? game.sideHazards.spikes + 1 : 1;
				} else if (args[2] === 'move: Toxic Spikes') {
					game.sideHazards.tspikes = game.sideHazards.tspikes ? game.sideHazards.tspikes + 1 : 1;
				}
			} else {
				if (args[2] === 'move: Stealth Rock') {
					game.setHazards.sr = true;
				} else if (args[2] === 'move: Spikes') {
					game.setHazards.spikes = game.setHazards.spikes ? game.setHazards.spikes + 1 : 1;
				} else if (args[2] === 'move: Toxic Spikes') {
					game.setHazards.tspikes = game.setHazards.tspikes ? game.setHazards.tspikes + 1 : 1;
				}
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
				if (args[2] === 'move: Stealth Rock') game.sideHazards.sr = false;
				else if (args[2] === 'move: Spikes') game.sideHazards.spikes = 0;
				else if (args[2] === 'move: Toxic Spikes') game.sideHazards.tspikes = 0;
			} else {
				if (args[2] === 'move: Stealth Rock') game.setHazards.sr = false;
				else if (args[2] === 'move: Spikes') game.setHazards.spikes = 0;
				else if (args[2] === 'move: Toxic Spikes') game.setHazards.tspikes = 0;
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
			if (game && toID(args[1]) !== toID(Bot.status.nickName)) Bot.say(room, 'Welp, GG!');
			else if (game) Bot.say(room, 'Well played! GG!');
			else Bot.say(room, 'GG, both!');
			Bot.say(room, '/part');
			if (game) {
				/*
				if (game.tier === '[Gen 8] Super Staff Bros 4 (Wii U)' && config.autoLadder) {
					Bot.say('', '/search gen8superstaffbros4wiiu');
				}
				*/
				return delete BattleAI.games[room];
			} else return;
		}
	}
};
