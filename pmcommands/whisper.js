module.exports = {
	help: `PMs a user. Syntax: ${prefix}whisper (user), (message)`,
	permissions: 'admin',
	commandFunction: function (Bot, by, args, client) {
		let a = args.join(' ').split(',');
    if (!a[0]) return Bot.pm(by, unxa);
    return Bot.pm(a.shift(), a.join(','));
	}
}