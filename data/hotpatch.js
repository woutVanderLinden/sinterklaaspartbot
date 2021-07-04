module.exports = function (type, by) {
	by = (by || ' Someone').replace(/^[^a-zA-Z0-9]*/, '');
	return new Promise((resolve, reject) => {
		switch (toID(type)) {

			case 'code': case 'repo': case 'codebase': case 'git': case 'github': {
				(async () => {
					try {
						require('child_process').execSync('git pull', { stdio: 'inherit' });
						Bot.log(`${by} hotpatched the code.`);
						return resolve('code');
					} catch (e) {
						Bot.log(e);
						return reject(e.message);
					}
				})();
				return;
			}

			case 'hotpatch': case 'self': case 'hotpatches': {
				delete require.cache[require.resolve('./hotpatch.js')];
				delete Bot.hotpatch;
				Bot.hotpatch = require('./hotpatch.js');
				Bot.log(`${by} hotpatched hotpatches.`);
				return resolve('hotpatches');
			}

			case 'global': {
				delete require.cache[require.resolve('../global.js')];
				globaljs = require('../global.js');
				Bot.log(`${by} hotpatched global.`);
				return resolve('global');
			}

			case 'tools': {
				delete require.cache[require.resolve('./tools.js')];
				global.tools = require('./tools.js');
				Bot.log(`${by} hotpatched tools.`);
				return resolve('tools');
			}

			case 'pokedex': case 'dex': {
				require('axios').get('https://play.pokemonshowdown.com/data/pokedex.json').then(res => {
					fs.writeFile('./data/DATA/pokedex.json', JSON.stringify(res.data, null, '\t'), err => {
						if (err) {
							Bot.log(err);
							return reject(err.message);
						}
						delete require.cache[require.resolve('./DATA/pokedex.json')];
						data.pokedex = require('./DATA/pokedex.json');
						Bot.log(`${by} hotpatched the Pokedex.`);
						return resolve('Pokedex');
					});
				});
				return;
				break;
			}

			case 'moves': case 'movedex': {
				require('axios').get('https://play.pokemonshowdown.com/data/moves.json').then(res => {
					fs.writeFile('./data/DATA/moves.json', JSON.stringify(res.data, null, '\t'), err => {
						if (err) {
							Bot.log(err);
							return reject(err.message);
						}
						delete require.cache[require.resolve('./DATA/moves.json')];
						data.pokedex = require('./DATA/moves.json');
						Bot.log(`${by} hotpatched the Movedex.`);
						return resolve('Movedex');
					});
				});
				return;
				break;
			}

			case 'aliases': {
				delete require.cache[require.resolve('./ALIASES/commands.json')];
				delete require.cache[require.resolve('./ALIASES/pmcommands.json')];
				delete require.cache[require.resolve('./ALIASES/discord.json')];
				tools.aliasDB = require('./ALIASES/commands.json');
				tools.pmAliasDB = require('./ALIASES/pmcommands.json');
				Bot.log(`${by} hotpatched aliases.`);
				return resolve('aliases');
				break;
			}

			case 'customcolours': case 'cc': case 'customcolors': {
				axios.get('http://play.pokemonshowdown.com/config/config.js').then(res => {
					fs.writeFile('./data/DATA/config.js', res.data + '\n\nexports.Config = Config;', err => {
						if (err) return reject(err.message);
						delete require.cache[require.resolve('./DATA/config.js')];
						Bot.log(`${by} hotpatched custom colours.`);
						return resolve('custom colours');
					});
				});
				break;
			}

			case 'autores': case 'ar': {
				delete require.cache[require.resolve('../autores.js')];
				Bot.log(`${by} hotpatched autores.`);
				return resolve('autores');
				break;
			}

			case 'board': case 'boards': {
				delete require.cache[require.resolve('./TABLE/boards.js')];
				delete require.cache[require.resolve('./TABLE/board.js')];
				delete require.cache[require.resolve('./TABLE/templates.js')];
				tools.board = require('./TABLE/boards.js').render;
				Bot.log(`${by} hotpatched boards.`);
				return resolve('boards');
				break;
			}

			case 'games': case 'g': case 'game': {
				GAMES.reload().then(() => {
					Bot.log(`${by} hotpatched games.`);
					return resolve('games');
				}).catch(err => {
					reject(err.message || 'Uh-oh');
					Bot.log(err);
					Bot.tempErr = err;
					Bot.say('botdevelopment', JSON.stringify(err));
				});
				break;
			}

			case 'battle': case 'ai': case 'battleai': case 'battles': {
				delete require.cache[require.resolve('../battle.js')];
				Bot.log(`${by} hotpatched battles.`);
				return resolve('battles');
				break;
			}

			case 'discordchat': case 'discord': case 'disc': {
				delete require.cache[require.resolve('../discord_chat.js')];
				Bot.log(`${by} hotpatched Discord chat.`);
				return resolve('Discord chat');
				break;
			}

			case 'chathandler': case 'chat': {
				delete require.cache[require.resolve('../chat.js')];
				delete Bot.chatHandler;
				Bot.chatHandler = require('../chat.js');
				Bot.log(`${by} hotpatched the chat handler.`);
				return resolve('chat handler');
				break;
			}

			case 'pmhandler': case 'pms': {
				delete require.cache[require.resolve('../pmhandler.js')];
				delete Bot.pmHandler;
				Bot.pmHandler = require('../pmhandler.js');
				Bot.log(`${by} hotpatched the PM handler.`);
				return resolve('PM handler');
				break;
			}

			case 'tour': case 'tours': case 'tournaments': case 'tournament': {
				delete require.cache[require.resolve('../tours.js')];
				Bot.log(`${by} hotpatched tournaments.`);
				return resolve('tournaments');
				break;
			}

			case 'ticker': case 'tick': {
				delete require.cache[require.resolve('../ticker.js')];
				Bot.log(`${by} hotpatched the ticker.`);
				return resolve('ticker');
				break;
			}

			case 'minor': case 'minorhandler': case 'minors': {
				delete require.cache[require.resolve('../minorhandler.js')];
				let minor = require('../minorhandler.js').handler;
				minor.initialize();
				Object.keys(minor).forEach(key => Bot._events[key] = minor[key]);
				Bot.log(`${by} hotpatched the minorhandler.`);
				return resolve('minorhandler');
				break;
			}

			case 'router': case 'route': case 'routes': case 'site': {
				delete Bot.router;
				delete require.cache[require.resolve('../router.js')];
				Bot.router = require('../router.js');
				Bot.log(`${by} hotpatched the router.`);
				return resolve('router');
				break;
			}

			case 'watcher': case 'watch': {
				delete require.cache[require.resolve('../watcher.js')];
				Bot.watcher.close();
				delete Bot.watcher;
				Bot.watcher = require('../watcher.js')();
				Bot.log(`${by} hotpatched the watcher.`);
				return resolve('watcher');
				break;
			}

			default: return reject('Unable to find a valid hotpatch.');
		}
	});
}