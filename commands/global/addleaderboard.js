// TODO: Use room config instead
/* eslint-disable no-unreachable */

module.exports = {
	cooldown: 6000,
	// eslint-disable-next-line max-len
	help: `Adds a leaderboard for the room. Syntax: ${prefix}addleaderboard n, ...words - n is the number of currencies, and words are the standard labels.`,
	permissions: 'coder',
	commandFunction: function (Bot, room, time, by, args, client) {
		return Bot.say(room, `Yeeted. Use configs!`);
		if (Bot.rooms[room].lb) return Bot.say(room, 'This room already has a leaderboard!');
		const data = { users: {}, points: [] };
		args = args.join(' ').split(/\s*,\s*/);
		if (!args.length) return Bot.say(room, unxa);
		const n = parseInt(args.shift());
		if (isNaN(n)) return Bot.say(room, this.help);
		if (args.length !== 3 * n) {
			return Bot.say(room, "You need to specify all three labels for each currency! (singular, plural, abbreviated)");
		}
		args = args.map(arg => arg.replace(/</g, '&lt;').replace(/>/g, '&gt;'));
		for (let i = 0; i < n; i++) data.points.push(args.splice(0, 3));
		fs.writeFile(`./data/POINTS/${room}.json`, JSON.stringify(data, null, 2), e => {
			if (e) {
				console.log(e);
				Bot.log(e);
				Bot.say(room, e.message);
				return;
			}
			Bot.say(room, 'Leaderboard added!');
			tools.loadLB(room);
		});
	}
};
