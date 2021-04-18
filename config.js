const debug = true;

exports.prefix = "]";
exports.PORT = 8080;
exports.server = 'sim.smogon.com';
exports.port = 8000;
exports.serverid = 'showdown';
exports.avatar = 'supernerd';
exports.nickName = "PartProfessor";
exports.pass = require('../config.js').pass;
exports.token = require('../config.js').token;
exports.autoJoin = debug ? ['botdevelopment'] : ['botdevelopment'];
exports.status = false;
exports.ignoreRooms = [];
exports.websiteLink = ``;
exports.logRooms = []; // Please do not use this without permission from a room owner

exports.owner = 'PartMan';

exports.auth = {
	admin: ['partman', 'fakepart', 'vampart', 'partoru', 'thealter'],
	adminalts: [],
	coder: [],
	coderalts: [],
	alpha: [],
	alphaalts: [],
	pseudoalpha: [],
	beta: [],
	betaalts: [],
	pseudobeta: [],
	gamma: [],
	gammaalts: [],
	pseudogamma: [],
	locked: [],
	lockedalts: []
}
