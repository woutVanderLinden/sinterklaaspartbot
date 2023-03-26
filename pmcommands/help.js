module.exports = {
	help: `Displays the help for a specific command. Syntax: ${prefix}help (command)`,
	permissions: 'locked',
	commandFunction: function (Bot, by, args, client) {
		if (!args[0]) {
			// eslint-disable-next-line max-len
			return Bot.pm(by, 'I\'m a Bot by PartMan. If you have any issues regarding me, please contact them. To see my usable commands, use ``' + prefix + 'commands`` in a chatroom.');
		}
		const name = tools.pmCommandAlias(args.join(''));
		fs.readdir('./pmcommands', (err, files) => {
			if (err) {
				Bot.pm(by, e.message);
				return Bot.log(e);
			}
			if (!files.includes(name + '.js')) return Bot.pm(by, `It doesn't look like that command exists...`);
			const cReq = require(`./${name}.js`);
			if (cReq && !tools.hasPermission(by, cReq.permissions)) return Bot.pm(by, 'Shh.');
			if (!cReq.help) return Bot.pm(by, 'The help for that command wasn\'t found...');
			return Bot.pm(by, cReq.help);
		});
	}
};
