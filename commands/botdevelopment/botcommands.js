module.exports = {
	cooldown: 10000,
	help: `Displays the Gist with some information on PS Bot commands.`,
	permissions: 'none',
	commandFunction: function (Bot, room, time, by, args, client) {
		Bot.say(room, `https://gist.github.com/PartMan7/573d25eff91cab704ab8539822131591`);
	}
};
