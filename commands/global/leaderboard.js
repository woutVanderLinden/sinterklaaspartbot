// TODO: Refactor

module.exports = {
	cooldown: 10,
	help: `Displays the Leaderboard for the room.`,
	permissions: 'none',
	commandFunction: function (Bot, room, time, by, args, client) {
		const lb = Bot.rooms[room].lb, shop = Bot.rooms[room].shop;
		if (!lb) return Bot.pm(by, 'Nope, no leaderboard here.');
		if (room === 'hindi' && !tools.hasPermission(by, 'gamma', room)) {
			return Bot.roomReply(room, by, `Sorry, isko disable kiya hai; PMs mei \`\`${prefix}lb hindi, 50\`\` try kar lo!`);
		}
		const sort = row => row.reduce((a, b, i) => a + (i ? b / 100000 ** i : 0), 0);
		const info = Object.keys(lb.users).map(user => [lb.users[user].name, ...lb.users[user].points]);
		if (!info.length) return Bot.say(room, "Empty board. o.o");
		// eslint-disable-next-line max-len
		const boardArgs = [info, ['Name', ...lb.points.map(p => p[2])], sort, ['40px', '160px', ...Array.from({ length: lb.points.length }).map(t => Math.floor(150 / lb.points.length) + 'px')], Bot.rooms[room].template || 'orange', null, parseInt(toID(args.join(''))) || 10, 'Rank', true];
		const html = tools.board(...boardArgs);
		if (typeof html !== 'string') return Bot.pm(by, 'Something went wrong.', Bot.log(html));
		if (tools.hasPermission(by, 'gamma', room) && tools.canHTML(room)) {
			return Bot.say(room, '/adduhtml LB, <div style="max-height:320px;overflow-y:scroll"><center>' + html + '</center></div>');
		} else return Bot.sendHTML(by, '<div style="max-height:320px;overflow-y:scroll"><center>' + html + '</center></div>');
	}
};
