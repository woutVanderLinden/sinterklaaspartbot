module.exports = {
	cooldown: 0,
	help: `Configures your PoGo info. Syntax: ${prefix}setuser (entry1): (value1), (entry2): (value2)...`,
	permissions: 'none',
	commandFunction: function (Bot, room, time, by, args, client, isFrom) {
		const protoDB = require('origindb')('data/POGO'), DB = protoDB('users');
		const username = toID(by), displayName = by.substr(1);
		const user = DB.get(username) || { raids: {} };
		if (user === 'constructor') return Bot.pm(isFrom, `...can you not, please?`);
		user.username = username;
		user.displayName = displayName;
		const validEntries = ['code', 'ign', 'level'];
		const entries = args.join(' ').replace(/[^a-zA-Z0-9,:]/g, '').split(',').filter(k => k.indexOf(':') >= 0).map(k => k.split(':', 2)).filter(k => k[1]).map(k => [k[0].toLowerCase(), k[1]]);
		for (const entry of entries) {
			if (!validEntries.includes(entry[0])) return Bot.roomReply(room, by, `Sorry, that wasn't a valid entry! Valid entries are: ${validEntries.join(', ')}`);
			user[entry[0]] = entry[1];
		}
		let missing = validEntries.find(entry => !user.hasOwnProperty(entry));
		if (missing) return Bot.roomReply(room, by, `You're missing a required entry (${missing})`);
		if (!/^\d{12}$/.test(user.code)) return Bot.roomReply(room, by, `Your given FC (${user.code}) was invalid`);
		if (!/^(?:50|[1-4]?[0-9])$/.test(user.level)) return Bot.roomReply(room, by, `Your given level (${user.level}) was invalid`);
		DB.set(username, user);
		Bot.say(room, `/sendprivatehtmlbox ${isFrom || by}, ${tools.escapeHTML(user.displayName)}'s profile is: ${[user.ign, ` (Lv ${user.level})`, ` [FC: ${user.code}]`].map(tools.unescapeHTML).join('')}`)
	}
}