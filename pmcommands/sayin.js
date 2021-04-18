module.exports = {
	help: `Says () in (). Syntax: ${prefix}sayin (room), (message)`,
	permissions: 'admin',
	commandFunction: function (Bot, by, args, client) {
		let a = args.join(' ').split(',');
		if (!a[0]) return Bot.pm(by, unxa);
		return Bot.say((a.shift().toLowerCase().replace(/[^a-z0-9-]/g, '')), a.join(','));
	}
}