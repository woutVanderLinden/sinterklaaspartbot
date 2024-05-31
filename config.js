const debug = false;

exports.prefix = 'PREFIX_HERE';
exports.webPort = 8080;
exports.avatar = 'supernerd';
exports.nickName = 'sinterklaas';
exports.pass = 'sinterklaas';
exports.token = 'DISCORD_TOKEN_HERE'; // leave blank to disable Discord
exports.autoJoin = debug ? ['botdevelopment', 'nederlands'] : ['botdevelopment']; // The second is the rooms to be joined normally
exports.status = false; // Set to a string if you want a status
exports.ignoreRooms = []; // Will be phased out
exports.websiteLink = `http://localhost:${exports.webPort}`; // Local address; IP addresses and hosted domains both work
exports.logRooms = []; // Do NOT use this without permission from a room owner

exports.owner = 'kingbaruk';
exports.discordAdmins = ['ADMIN_ID']; // Array of Discord IDs of administrators

exports.auth = {
	admin: ['kingbaruk'],
	coder: ['kingbaruk'],
	alpha: [],
	beta: [],
	gamma: [],
	locked: []
};

exports.mongoURL = `mongodb://localhost:27017/PartBot`; // Put in a valid MongoDB URL here
