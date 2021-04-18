module.exports = {
	cooldown: 100,
	help: `㋛`,
	permissions: 'gamma',
	commandFunction: function (Bot, room, time, by, args, client) {
		Bot.say(room, `${Array.from({length: parseInt(toID(args.join(' '))) || 1}).map(t => `㋛^^㋛㋛^^㋛\\\\㋛㋛\\\\`).join('')}`);
	}
}