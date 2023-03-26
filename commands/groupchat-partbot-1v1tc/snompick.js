module.exports = {
	cooldown: 1000,
	help: `The mighty Snom shall choose!`,
	permissions: 'gamma',
	commandFunction: function (Bot, room, time, by, args, client) {
		Bot.say(room, `${args[0] ? `The mighty Snom has chosen: ${args.join(' ').split(',')[Math.floor(Math.random() * args.join(' ').split(',').length)]}!` : 'The mighty Snom did not listen to your request.'}`);
	}
};
