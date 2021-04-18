module.exports = {
	help: `Board Games Galore!`,
	permissions: 'none',
	commandFunction: function (Bot, by, args, client) {
		Bot.pm(by, `/invite Board Games`);
	}
}