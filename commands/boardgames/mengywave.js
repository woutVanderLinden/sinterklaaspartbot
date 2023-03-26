module.exports = {
	cooldown: 100,
	help: `㋛`,
	permissions: 'gamma',
	commandFunction: function (Bot, room, time, by, args, client) {
		Bot.say(room, `㋛^^㋛㋛^^㋛\\\\㋛㋛\\\\`.repeat(~~args.join('')));
	}
};
