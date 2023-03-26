module.exports = {
	cooldown: 10,
	help: `Runs commands from another room.`,
	permissions: 'admin',
	commandFunction: function (Bot, room, time, by, args, client) {
		let [inRoom, msg] = args.join(' ').split('|');
		inRoom = tools.getRoom(inRoom);
		if (!msg) return Bot.roomReply('Oi');
		const nArgs = msg.trim().split(' '), command = toID(nArgs.shift());
		try {
			require(`../${inRoom}/${tools.commandAlias(command)}.js`).commandFunction(Bot, room, time, by, nArgs, client);
		} catch (e) {
			Bot.roomReply(room, by, `${require('util').inspect(e)}`);
		}
	}
};
