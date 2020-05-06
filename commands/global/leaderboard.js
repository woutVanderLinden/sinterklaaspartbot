module.exports = {
	cooldown: 10,
	help: `Displays the Leaderboard for the room.`,
	permissions: 'none',
	commandFunction: function (Bot, room, time, by, args, client) {
		let html, shop = Bot.rooms[room].shop;
		if (!shop) return Bot.pm(by, 'Nope, no leaderboard here.');
		switch (room) {
			default: {
				let sort = (/w(?:ater)?c(?:ookie)?/.test(toId(args.join(''))) ? (row) => row[1] / 10000 + row[2] : (row) => row[1] + row[2] / 10000);
				let data = Object.keys(shop.users).map(user => [shop.users[user].name, ...shop.users[user].points]);
				html = tools.board(data, ['Name', shop.points[2], shop.spc[2]], sort, ['40px', '160px', '70px', '70px'], 'water', null, 10, 'Rank');
				if (typeof html !== 'string') return Bot.pm(by, 'Something went wrong.');
				if (tools.hasPermission(by, 'gamma', room) && tools.canHTML(room)) return Bot.say(room, '/adduhtml LB, <CENTER>' + html + '</CENTER>');
				else return Bot.sendHTML(by, '<CENTER>' + html + '</CENTER>');
				break;
			}
		}
	}
}
