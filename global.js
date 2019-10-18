/**************************
*         Ranks           *
**************************/

global.admin = [];
global.coder = [];
global.alpha = [];
global.beta = [];
global.gamma = [];
global.locked = [];

global.adminalts = []; //Alts and Pseudo arrays store translated auth and alts for innate auth. Ideally, these should be empty when starting.
global.coderalts = [];
global.alphaalts = [];
global.betaalts = [];
global.gammaalts = [];
global.lockedalts = [];

global.pseudoalpha = [];
global.pseudobeta = [];
global.pseudogamma = [];


/**************************
*        Requires         *
**************************/

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


/**************************
*          Data           *
**************************/

global.data = {
	pokedex: require('./data/DATA/pokedex.js').BattlePokedex,
	users: JSON.parse(fs.readFileSync('./data/DATA/users.json', 'utf8')),
	items: require('./data/DATA/items.js').BattleItems
}


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
