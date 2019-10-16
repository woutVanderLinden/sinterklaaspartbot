global.config = require('./config.js');
global.prefix = config.prefix;
global.tools = require('./data/tools.js')

global.toId = function (text) {
  if (typeof text === 'string') return text.toLowerCase().replace(/[^a-z0-9]/g, '');
}


/**************************
*        Modules          *
**************************/

global.url = require('url');
global.https= require('https');
global.fs = require('fs');


/**************************
*        Storage          *
**************************/

global.queryRoom = '';
global.cooldownObject = {};
global.ignoreRooms = config.ignoreRooms.map(room => room.replace(/[^0-9a-z-]/g, ''));


/**************************
*     Abbreviations       *
**************************/

global.unxa = 'Unexpected number of arguments.';
global.tcroom = '1v1typechallenge';
global.typelist = ['bug', 'dark', 'dragon', 'electric', 'fairy', 'fighting', 'fire', 'flying', 'ghost', 'grass', 'ground', 'ice', 'normal', 'poison', 'psychic', 'rock', 'steel', 'water'];
global.AkasiAnse = 0;
global.UnleashOurPassion = 1;



/**************************
*          Data           *
**************************/

global.data = {
	pokedex: require('./data/DATA/pokedex.js').BattlePokedex,
	users: JSON.parse(fs.readFileSync('./data/DATA/users.json', 'utf8')),
	items: require('./data/DATA/items.js').BattleItems
}


/**************************
*         Ranks           *
**************************/

global.admin = ['partman', 'vampart'];
global.adminalts = [];
global.coder = [];
global.coderalts = [];
global.alpha = ['ironcrusher', 'unleashourpassion', '1v1sp', 'allfourtyone', 'armaldlo', 'tapiocatopic', 'yeche'];
global.alphaalts = [];
global.pseudoalpha = [];
global.beta = ['666lesbian69', 'cabbbages', 'smajet', 'tallydaorangez', 'theseelgoesmeow', 'tlouk'];
global.betaalts = [];
global.pseudobeta = [];
global.gamma = [];
global.gammaalts = [];
global.pseudogamma = [];
global.locked = [];
global.lockedalts = [];


/**************************
*         Polls           *
**************************/

global.pollObject = {
	'1v1typechallenge': {
		votes: {},
		active: false,
		autostart: false,
		official: false,
		endTime: 0
	}
}

global.blitzObject = {
	'1v1typechallenge': {
		active: false,
		autostart: false,
		official: false
	}
}