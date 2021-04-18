module.exports = {
	help: `Does stuff.`,
	permissions: 'admin',
	commandFunction: function (Bot, by, args, client) {
		Bot.pm(by, args.join(' '));
	}
}