module.exports = {
	cooldown: 0,
	help: `Random Mastermind guesses!`,
	permissions: 'none',
	commandFunction: function (Bot, room, time, by, args, client) {
		Bot.say(room, Math.floor(Math.random() * 4096).toString(8).padStart(4, '0'));
	}
};
