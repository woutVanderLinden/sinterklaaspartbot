module.exports = {
	cooldown: 1,
	help: `Hotpatches stuff.`,
	permissions: 'coder',
	commandFunction: function (Bot, room, time, by, args, client) {
		if (!args[0]) return Bot.say(room, unxa);
		switch(args[0].toLowerCase()) {
			case 'bot': {
				require('child_process').exec('git pull');
				setTimeout(() => {
					Bot.say(room, 'Restarting...');
					process.exit();
				}, 10000);
				break;
			}
			case 'global': {
				delete require.cache[require.resolve('../../global.js')];
				globaljs = require('../../global.js');
				Bot.say(room, 'Global has been hotpatched.');
				Bot.log(by.substr(1) + ' hotpatched global.');
				break;
			}
			case 'pokedex': case 'dex': {
				require('axios').get('https://play.pokemonshowdown.com/data/pokedex.js').then(res => {
					fs.writeFile('./data/TEMP/pokedex.js', res.data, e => {
						if (e) {
							Bot.say(room, e.message);
							return Bot.log(e);
						}
						let dex = require('../../data/TEMP/pokedex.js');
						fs.writeFile('./data/DATA/pokedex.json', JSON.stringify(dex.BattlePokedex, null, '\t'), err => {
							if (err) {
								Bot.say(room, err.message);
								return Bot.log(err);
							}
							delete require.cache[require.resolve('../../data/TEMP/pokedex.js')];
							fs.unlink('./data/TEMP/pokedex.js', e => e ? Bot.log(e) : '');
							delete require.cache[require.resolve('../../data/DATA/pokedex.json')];
							data.pokedex = require('../../data/DATA/pokedex.json');
							Bot.say(room, "The Pokedex has been hotpatched.");
							Bot.log(by.substr(1) + ' hotpatched Pokedex.');
						});
					});
				});
				break;
			}
			case 'tools': {
				delete require.cache[require.resolve('../../data/tools.js')];
				global.tools = require('../../data/tools.js');
				Bot.say(room, 'Tools have been hotpatched.');
				Bot.log(by.substr(1) + ' hotpatched tools.');
				break;
			}
			case 'aliases': {
				delete require.cache[require.resolve('../../data/ALIASES/commands.json')];
				delete require.cache[require.resolve('../../data/ALIASES/pmcommands.json')];
				delete require.cache[require.resolve('../../data/ALIASES/discord.json')];
				tools.aliasDB = require('../../data/ALIASES/commands.json');
				tools.pmAliasDB = require('../../data/ALIASES/pmcommands.json');
				Bot.say(room, "Aliases have been hotpatched!");
				Bot.log(by.substr(1) + ' hotpatched aliases.');
				break;
			}
			case 'customcolours': case 'cc': case 'customcolors': {
				require('request')('http://play.pokemonshowdown.com/config/config.js', (error, response, body) => { 
					fs.writeFileSync('./data/DATA/config.js', body + '\n\nexports.Config = Config;');
					delete require.cache[require.resolve('../../data/DATA/config.js')];
					Bot.say(room, 'Custom colours have been hotpatched.');
					Bot.log(by.substr(1) + " hotpatched custom colours.");
				});
				break;
			}
			case 'autores': case 'ar': {
				delete require.cache[require.resolve('../../autores.js')];
				Bot.say(room, 'Chat has been hotpatched.');
				return Bot.log(by.substr(1) + ' hotpatched chat.');
				break;
			}
			case 'board': case 'boards': {
				delete require.cache[require.resolve('../../data/boards.js')];
				delete require.cache[require.resolve('../../data/board.js')];
				delete require.cache[require.resolve('../../data/templates.js')];
				tools.board = require('../../data/boards.js').render;
				Bot.say(room, 'Boards have been hotpatched.');
				return Bot.log(by.substr(1) + " hotpatched boards.");
				break;
			}
			case 'battle': {
				delete require.cache[require.resolve('../../battle.js')];
				BattleAI = require('../../battle.js').handler;
			}
			case 'ai': {
				delete require.cache[require.resolve('../../data/BATTLE/ai.js')];
				BattleAI = require('../../data/BATTLE/ai.js');
				Bot.say(room, 'Battle AI has been hotpatched.');
				return Bot.log(by.substr(1) + ' hotpatched the Battle AI.');
				break;
			}
			case 'games': {
				let games = [{
					name: 'Chess',
					loc: 'chess.js'
				},
				{
					name: 'Othello',
					loc: 'othello.js'
				},
				{
					name: 'CR',
					loc: 'chainreaction.js'
				},
				{
					name: 'Scrabble',
					loc: 'scrabble.js'
				},
				{
					name: "LO",
					loc: "lightsout.js"
				},
				{
					name: "Mastermind",
					loc: "mastermind.js"
				}];
				games.forEach(game => {
					delete tools[game.name];
					delete require.cache[require.resolve(`../../data/GAMES/${game.loc}`)];
					tools[game.name] = require(`../../data/GAMES/${game.loc}`)[game.name];
				});
				Bot.say(room, 'Games have been hotpatched.');
				Bot.log(by.substr(1) + ' hotpatched games.');
				break;
			}
			case 'routes': {
				delete Bot.router;
				delete require.cache[require.resolve('../../router.js')];
				Bot.router = require('../../router.js');
				Bot.say(room, 'Routes have been hotpatched.');
				Bot.log(by.substr(1) + ' hotpatched routes.');
				break;
			}
			case 'teams': {
				Bot.teams = {
					OU: ["Terrakion||focussash|justified|closecombat,stoneedge,stealthrock,swordsdance|Jolly|,252,4,,,252|||||]Bisharp||blackglasses|defiant|suckerpunch,knockoff,ironhead,swordsdance|Adamant|,252,4,,,252|||||]Sigilyph||lifeorb|magicguard|calmmind,psychic,heatwave,dazzlinggleam|Timid|4,,,252,,252||,0,,,,|||]Ninetales-Alola||lightclay|snowwarning|moonblast,freezedry,auroraveil,hail|Timid|248,,,8,,252||,0,,,,|||]Zeraora||lifeorb|voltabsorb|plasmafists,closecombat,knockoff,grassknot|Naive|,252,,4,,252|||||]Necrozma||weaknesspolicy|prismarmor|calmmind,photongeyser,heatwave,rockpolish|Modest|,,4,252,,252||,0,,,,|||", "Scizor||lifeorb|technician|swordsdance,bulletpunch,psychocut,knockoff|Adamant|40,252,,,,216|||||]Rillaboom||choiceband|grassysurge|woodhammer,grassyglide,superpower,uturn|Adamant|,252,,,4,252|||||]Crawdaunt||lifeorb|adaptability|swordsdance,knockoff,crabhammer,aquajet|Adamant|4,252,,,,252|||||]Togekiss||choicescarf|serenegrace|trick,airslash,dazzlinggleam,flamethrower|Timid|,,,252,4,252||,0,,,,|||]Zeraora||lifeorb|voltabsorb|plasmafists,knockoff,closecombat,grassknot|Naughty|,252,,4,,252|||||]Necrozma||powerherb|prismarmor|meteorbeam,stealthrock,photongeyser,heatwave|Modest|72,,,240,12,184||,0,,,,|||", "Dragapult||lifeorb|infiltrator|dragondance,dragondarts,steelwing,fireblast|Adamant|,252,,,4,252|||||]Indeedee||choicescarf|psychicsurge|expandingforce,dazzlinggleam,mysticalfire,trick|Timid|,,,252,4,252||,0,,,,|||]Hawlucha||psychicseed|unburden|swordsdance,acrobatics,closecombat,taunt|Adamant|,252,4,,,252|||||]Toxtricity||lifeorb|punkrock|shiftgear,drainpunch,boomburst,overdrive|Modest|,32,,252,,144|||||]Excadrill||focussash|moldbreaker|stealthrock,earthquake,rapidspin,steelbeam|Naive|,252,,4,,252|||||]Kommo-o||throatspray|bulletproof|clangingscales,flashcannon,closecombat,clangoroussoul|Naive|,4,,252,,252|||||"]
				}
				Bot.say(room, "Teams have been hotpatched.");
				Bot.log(by.substr(1) + ' hotpatched teams.');
				break;
			}
			case 'discord': {
				delete require.cache[require.resolve('../../discord_chat.js')];
				Bot.say(room, "Discord has been hotpatched.");
				Bot.log(by.substr(1) + ' hotpatched Discord.');
				break;
			}
			case 'chathandler': case 'chat': {
				delete Bot.chatHandler;
				delete require.cache[require.resolve('../../chat.js')];
				Bot.chatHandler = require('../../chat.js');
				Bot.say(room, "The chat handler has been hotpatched.");
				Bot.log(by.substr(1),  + ' hotpatched the chat handler.');
				break;
			}
			default: {
				Bot.say(room, 'Invalid hotpatch.');
				break;
			}
		}
	}
}