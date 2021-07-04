module.exports = {
	cooldown: 1000,
	help: `Sets the delay between questions. Syntax: ${prefix}setdelay (time in ms)`,
	permissions: 'gamma',
	commandFunction: function (Bot, room, time, by, args, client) {
		if (!args[0]) return Bot.say(room, unxa);
		let ttime = parseInt(args.join('').replace(/[^0-9]/g));
		if (!ttime) return Bot.say(room, 'Invalid time.');
		Bot.rooms[room].delay = ttime;
		return Bot.say(room, 'The delay has been set to ' + ttime + ' ms.');
	}
}