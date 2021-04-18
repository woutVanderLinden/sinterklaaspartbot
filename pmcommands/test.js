module.exports = {
	help: `Pats a user.`,
	permissions: 'gamma',
	commandFunction: function (Bot, by, args, client) {
		Bot.pm(by, `/me tests ${args.length ? args.join(' ') : by.substr(1)}`);
	}
}