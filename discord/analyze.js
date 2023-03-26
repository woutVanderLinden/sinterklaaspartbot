module.exports = {
	help: `Analyzes a paste. Syntax: ${prefix}analyze (paste link), (optional: type of Challenge)`,
	guildOnly: '515170462037311498',
	commandFunction: function (args, message, Bot) {
		if (!message.member.roles.cache.find(role => role.name === 'Validator')) {
			return message.channel.send('Access denied.').then(msg => msg.delete({ timeout: 3000 }));
		}
		args = args.join(' ').split(/\s*,\s*/);
		if (!args.length) return message.channel.send(unxa).then(msg => msg.delete({ timeout: 3000 }));
		const paste = args[0];
		if (!/^https?:\/\/pokepast\.es\/[a-z0-9]+(?:\/raw)?$/.test(paste)) return message.channel.send("Inavlid paste.");
		if (!args[0].endsWith('/raw')) args[0] += '/raw';
		axios.get(paste).then(res => {
			let replays = res.data.match(/https?:\/\/replay.pokemonshowdown.com\/gen[78]1v1-\d{9,10}(?:-[a-z0-9]+)?/g);
			if (!replays) return Bot.log("Couldn't find replays.");
			replays = replays.map(replay => replay + '.log');
			Promise.all(replays.map(replay => {
				return new Promise((resolve, reject) => {
					axios.get(replay).then(response => {
						const players = response.data.match(/\n\|player\|p[12]\|[^|]+/g);
						if (!players) return message.channel.send("RED ALERT RED ALERT");
						resolve(players.map(t => toID(t.split('|')[3])));
					}).catch(reject);
				});
			})).then(allPlayers => {
				let id;
				if (!allPlayers.filter(s => !s.includes(allPlayers[0][0])).length) id = allPlayers[0][0];
				else if (!allPlayers.filter(s => !s.includes(allPlayers[0][1])).length) id = allPlayers[0][1];
				else return message.channel.send("Errm, there wasn't a user that was in all of those.");
				const output = { userid: id, team: {} };
				Promise.all(replays.map(replay => {
					return new Promise((resolve, reject) => {
						try {
							axios.get(replay).then(res => {
								const data = res.data;
								const result = {
									id: parseInt(replay.split(/gen[78]1v1-/)[1].split('-')[0]),
									type: false,
									rating: [],
									LL: false
								};
								const input = data.split('\n');
								let inThis = null, enemy = false;
								for (const line of input) {
									const args = line.split('|');
									switch (args[1]) {
										case 'player': {
											if (!args[3]) break;
											else if (toID(args[3]) === id) {
												inThis = args[2];
												output.avatar = args[4];
												output.username = args[3];
											} else if (enemy) {
												if (inThis) break;
												Bot.log(args[3]);
												reject(new Error("Player not found."));
												return;
											} else enemy = true;
											break;
										}
										case 'teamsize': {
											if (!inThis) {
												reject(new Error("Expected teamsize after player."));
												return;
											}
											if (args[2] !== inThis) result.oppSize = parseInt(args[3]);
											break;
										}
										case 'poke': {
											if (!inThis) {
												reject(new Error("Expected poke after player."));
												return;
											}
											if (args[2] === inThis) {
												const species = args[3].split(', ')[0].split('-')[0];
												if (!output.team[species]) output.team[species] = {
													species: undefined,
													level: 100,
													moves: []
												};
												if (/^L\d{1,2}$/.test(args[3].split(', ')[1])) {
													output.team[species].level = parseInt(args[3].split(', ')[1].substr(1));
												}
											}
											break;
										}
										case 'rated': {
											result.type = args[2] || 'rated';
											break;
										}
										case 'switch': {
											if (!inThis) {
												reject(new Error("Expected switch after player."));
												return;
											}
											if (args[2].startsWith(inThis + 'a: ')) {
												const mon = args[3].split(', ')[0].split('-')[0];
												output.team[mon].species = args[3].split(', ')[0];
												output.team[mon].nick = args[2].split(inThis + 'a: ')[1];
											}
											break;
										}
										case 'move': {
											if (!inThis) {
												reject(new Error("Expected move after player."));
												return;
											}
											if (args[2].startsWith(inThis + 'a: ')) {
												if (output.team[args[2].split(inThis + 'a: ')[1]]) {
													output.team[args[2].split(inThis + 'a: ')[1]].moves.push(args[3]);
												} else {
													// eslint-disable-next-line max-len
													Object.values(output.team).find(m => m.nick === args[2].split(inThis + 'a: ')[1]).moves.push(args[3]);
												}
											}
											break;
										}
										case 'win': {
											result.win = id === toID(args[2]);
											break;
										}
										case 'raw': {
											// eslint-disable-next-line max-len
											const match = args.join('|').match(/^\|raw\|(.*?)'s rating: (\d{4}) &rarr; <strong>(\d{4})<\/strong><br \/>\([+-]\d{1,2} for (?:winn|los)ing\)\s*$/);
											if (match && toID(match[1]) === id) {
												result.rating[0] = parseInt(match[2]);
												result.rating[1] = parseInt(match[3]);
												result.LL = true;
											}
											break;
										}
									}
								}
								resolve(result);
							});
						} catch (e) {
							Bot.log(e);
							Bot.log(output);
						}
					}).catch(error => {
						Bot.log(error);
						Bot.log(replay);
					});
				})).then(res => {
					let valid = true;
					function inValid (text) {
						valid = false;
						return text;
					}
					Object.keys(output.team).forEach(mon => output.team[mon].moves = [... new Set(output.team[mon].moves)]);
					Bot.log(res);
					// eslint-disable-next-line max-len
					message.channel.send("```\n" + res.sort((a, b) => a.id - b.id).map((term, index, arr) => `${term.win ? "W" : "L"} | ${term.rating[0] || '----'} - ${term.rating[1] || '----'} | ${term.rated === "rated" ? term.rated || "Unrated   " : "Rated     "} | ${term.rating[0] && index && arr[index - 1][1] && term.rating[0] !== arr[index - 1][1] ? inValid("Elo didn't match properly.") : term.oppSize < 3 ? "Opponent had " + term.oppSize + " Pokemon." : ''}`).join('\n') + "```");
					// eslint-disable-next-line max-len
					message.channel.send("```\n" + `${output.username}: \n\nTeam: \n${Object.keys(output.team).map(m => `${output.team[m].species || m}: ${output.team[m].moves.sort().join(' / ')}${output.team[m].level === 100 ? '' : ` | Lv${output.team[m].level}`}`).join('\n')}\n\nAvatar: ${output.avatar}` + "\n```");
					// message.channel.send("```\n" + require('util').inspect(output, true, 7) + "```");
					let W = 0, L = 0;
					res.forEach(match => {
						if (match.type === "rated" && match.oppSize === 3) {
							if (!match.win) L++;
							else if (match.rating[0] >= 1100 || match.rating[1] >= 1100 && match.win) W++;
						}
					});
					if (valid) message.channel.send(`Summary: ${W}-${L}`);
				}).catch(err => {
					Bot.log(err);
					Bot.log(require('util').inspect(output, true, 7));
				});
			});
		}).catch(Bot.log);
	}
};
