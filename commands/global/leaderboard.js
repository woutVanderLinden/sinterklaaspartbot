module.exports = {
	cooldown: 10,
	help: `Displays the Leaderboard for the room.`,
	permissions: 'none',
	commandFunction: function (Bot, room, time, by, args, client) {
		let html, lb = Bot.rooms[room].lb, shop = Bot.rooms[room].shop;
		if (!lb) return Bot.pm(by, 'Nope, no leaderboard here.');
		switch (room) {
			default: {
				let sort = row => row.reduce((a, b, i) => a + (i ? b / (100000 ** i) : 0), 0);
				let data = Object.keys(lb.users).map(user => [lb.users[user].name, ...lb.users[user].points]);
				if (!data.length) return Bot.say(room, "Empty board. o.o");
				html = tools.board(data, ['Name', ...lb.points.map(p => p[2])], sort, ['40px', '160px', ...Array.from({length: lb.points.length}).map(t => Math.floor(150 / lb.points.length) + 'px')], 'orange', null, parseInt(toId(args.join(''))) || 10, 'Rank');
				if (typeof html !== 'string') return Bot.pm(by, 'Something went wrong.');
				if (tools.hasPermission(by, 'gamma', room) && tools.canHTML(room)) return Bot.say(room, '/adduhtml LB, <div style="max-height: 320px; overflow-y: scroll;"><center>' + html + '</center></div>');
				else return Bot.sendHTML(by, '<div style="max-height: 320px; overflow-y: scroll;"><center>' + html + '</center></div>');
				break;
			}
		}
	}
}