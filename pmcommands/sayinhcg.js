module.exports = {
	help: ``,
	permissions: 'admin',
	commandFunction: function (Bot, by, args, client) {
		Bot.pm(by, `${client.channels.cache.get('226909807548825600').send(args.join(' '))}`);
	}
}