module.exports = {
	help: `Checks for alts of the given user. Requires you to be roomstaff in one of PartBot's rooms.`,
	permissions: 'none',
	commandFunction: function (Bot, by, args, client) {
		for (let r in Bot.rooms) {
			r = Bot.rooms[r];
			if (['Hindi', 'Board Games', '2v2'].includes(r.title)) {
				if (tools.hasPermission(by, 'beta', toId(r.title)) || /^[%@*&]/.test(by)) {
					const user = toId(args.join(''));
					if (!user) return Bot.pm(by, `Whose?`);
					const alts = require('origindb')('data/DATA')('alts').get(user);
					if (!alts || !alts.length) return Bot.pm(by, `${user} has no known alts.`);
					return Bot.sendHTML(by, `<details><summary>${user}'s alts [${alts.length}]</summary><hr />${alts.sort().join(', ')}</details>`);
				}
			}
		}
		return Bot.pm(by, 'Access denied.');
	}
}