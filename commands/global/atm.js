module.exports = {
	cooldown: 100,
	help: `Displays a user's points in the room.`,
	permissions: 'none',
	commandFunction: function (Bot, room, time, by, args, client) {
		let out, user = args[0] ? toId(args.join('')) : toId(by);
		if (!Bot.rooms[room].shop) out = 'This room doesn\'t have a Shop.';
		else if (Bot.rooms[room].shop.users[user]) {
			if (Bot.rooms[room].shop.users[user].points[0] || Bot.rooms[room].shop.users[user].points[1]) {
				let p, q;
				out = ` ${Bot.rooms[room].shop.users[user].name}'${user.endsWith('s') ? '' : 's'} points: ${p = Bot.rooms[room].shop.users[user].points[0]} ${p == 1 ? Bot.rooms[room].shop.points[0] : Bot.rooms[room].shop.points[1]}, ${q = Bot.rooms[room].shop.users[user].points[1]} ${q == 1 ? Bot.rooms[room].shop.spc[0] : Bot.rooms[room].shop.spc[1]}.`;
			}
			else out = 'This user doesn\'t have any points in this room!';
		}
		else out = 'This user doesn\'t have any points in this room!';
		if (tools.hasPermission(by, 'gamma', room)) return Bot.say(room, out);
		else return Bot.pm(by, out);
	}
}