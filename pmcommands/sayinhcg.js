module.exports = {
	help: ``,
	permissions: 'admin',
	commandFunction: function (Bot, by, args, client) {
		try {
			Bot.pm(by, `${client.channels.cache.get('226909807548825600').send(args.join(' '))}`);
		} catch (e) {
			Bot.pm(by, e.message);
		}
	}
};
