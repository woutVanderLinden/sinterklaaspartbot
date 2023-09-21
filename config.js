const debug = false;

exports.prefix = '.';
exports.webPort = 8080;
exports.avatar = 'red';
exports.nickName = 'greninjaaura';
exports.pass = 'prakash1';
exports.token = 'DISCORD_TOKEN_HERE'; // leave blank to disable Discord
exports.autoJoin = debug ? ['botdevelopment'] : ['botdevelopment']; // The second is the rooms to be joined normally
exports.status = false; // Set to a string if you want a status
exports.ignoreRooms = []; // Will be phased out
exports.websiteLink = `http://localhost:${exports.webPort}`; // Local address; IP addresses and hosted domains both work
exports.logRooms = []; // Do NOT use this without permission from a room owner

exports.owner = 'ash red legend';
exports.discordAdmins = ['ADMIN_ID']; // Array of Discord IDs of administrators

exports.auth = {
	admin: ['ash red legend'],
	coder: [],
	alpha: [],
	beta: [],
	gamma: [],
	locked: []
};

exports.mongoURL = `mongodb://localhost:27017/PartBot`; // Put in a valid MongoDB URL here
