module.exports = {
	help: `Use ${prefix}help quovadis in a chatroom for complete information.`,
	permissions: 'none',
	commandFunction: function (Bot, by, args, client) {
		let qvCom = require('../commands/global/quovadis.js').commandFunction;
		if (!args.shift().toLowerCase() == 'play') return;
		let arg = args.join(' ').split(/, */);
		let room = arg.shift();
		room = room.toLowerCase().replace(/[^0-9a-z-]/g,'');
		if (!Bot.rooms[room]) return Bot.pm(by, "Invalid room.");
		return qvCom(Bot, room, Date.now(), by, ['play'].concat(arg.join(', ').split(' ')), client);
	}
}