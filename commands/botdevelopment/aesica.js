module.exports = {
	cooldown: 0,
	help: `-`,
	permissions: 'none',
	commandFunction: function (Bot, room, time, by, args, client) {
		Bot.say(room, `${toID(by)==='aesica'?`.${args.join(' ')}`:'/me dabs'}`);
	}
}