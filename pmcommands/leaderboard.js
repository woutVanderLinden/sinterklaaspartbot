module.exports = {
	help: `Displays the leaderboard for the given room. Syntax: ${prefix}leaderboard (room), (users to display [optional])`,
	permissions: 'none',
	commandFunction: function (Bot, by, args, client) {
		if (!args.length) {
			args = Object.keys(Bot.rooms).filter(room => Bot.rooms[room].users.find(u => toID(u) === toID(by)) && Bot.rooms[room].lb);
			if (args.length !== 1) return Bot.pm(by, 'Which room?');
		}
		let cargs = args.join('').split(',');
		let room = toID(cargs.shift());
		if (!room) return Bot.pm(by, 'Which room?');
		if (!Bot.rooms[room]) return Bot.pm(by, "I'm not in that room! (does it even exist?)");
		let html, lb = Bot.rooms[room].lb, shop = Bot.rooms[room].shop;
		if (!lb) return Bot.pm(by, 'Nope, no leaderboard there.');
		switch (room) {
			default: {
				let sort = row => row.reduce((a, b, i) => a + (i ? b / (100000 ** i) : 0), 0);
				let data = Object.keys(lb.users).map(user => [lb.users[user].name, ...lb.users[user].points]);
				if (!data.length) return Bot.pm(by, "Empty board. o.o");
				html = tools.board(data, ['Name', ...lb.points.map(p => p[2])], sort, ['40px', '160px', ...Array.from({length: lb.points.length}).map(t => Math.floor(150 / lb.points.length) + 'px')], Bot.rooms[room]?.template || 'orange', null, parseInt(toID(cargs.join(''))) || 10, 'Rank', true);
				if (typeof html !== 'string') return Bot.pm(by, 'Something went wrong.');
				return Bot.sendHTML(by, '<CENTER>' + html + '</CENTER>');
				break;
			}
		}
	}
}