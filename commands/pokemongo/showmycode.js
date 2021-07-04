module.exports = {
	cooldown: 500,
	help: `Broadcasts your Pokemon Go Friend Code.`,
	permissions: 'none',
	commandFunction: function (Bot, room, time, by, args, client) {
		const protoDB = require('origindb')('data/POGO'), DB = protoDB('users');
		const user = DB.get(toID(by));
		if (!user) return Bot.roomReply(room, by, `You're not registered - try registering using ${prefix}setuser!`);
		Bot.say(room, `${by.substr(1)} is registered as the Lv${user.level} ${user.displayName} - their Friend Code is ${user.code}.`);
	}
}