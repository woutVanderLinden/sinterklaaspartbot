module.exports = {
	cooldown: 100,
	help: `Displays a user's points in the room.`,
	permissions: 'none',
	commandFunction: function (Bot, room, time, by, args, client) {
		let out;
		const user = args[0] ? toID(args.join('')) : toID(by);
		if (!Bot.rooms[room].lb) out = 'This room doesn\'t have a Leaderboard.';
		else if (Bot.rooms[room].lb.users[user]) {
			if (Bot.rooms[room].lb.users[user].points.reduce((a, b) => a || b, false)) {
				const points = Bot.rooms[room].lb.users[user].points.filter((p, i) => p > 0 && Bot.rooms[room].lb.points[i]);
				const pointsStr = points.map((p, i) => p + ' ' + Bot.rooms[room].lb.points[i][2]).join(', ');
				out = ` ${Bot.rooms[room].lb.users[user].name}'s points: ${pointsStr}.`;
			} else out = 'This user doesn\'t have any points in this room!';
		} else out = 'This user doesn\'t have any points in this room!';
		if (tools.hasPermission(by, 'gamma', room)) return Bot.say(room, out);
		else return Bot.pm(by, out);
	}
};
