const debug = false;

exports.prefix = "]";
exports.PORT = 8080;
exports.avatar = 'supernerd';
exports.nickName = "PartProfessor";
exports.pass = "Hi, Foxxeyy.";
exports.token = "DISCORD_TOKEN_HERE"; // leave blank to disable Discord
exports.autoJoin = debug ? ['botdevelopment'] : ['botdevelopment']; // The second is the rooms to be joined normally
exports.status = false; // Set to a string if you want a status
exports.ignoreRooms = []; // Will be phased out
exports.websiteLink = ``; // Local address; IP addresses and hosted domains both work
exports.logRooms = []; // Please do not use this without permission from a room owner

exports.owner = 'YOUR_USERNAME_HERE';
exports.discordAdmins = ['ADMIN_ID']; // Array of Discord IDs of administrators

exports.auth = {
	admin: ['ADMIN_USERID_HERE'],
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
