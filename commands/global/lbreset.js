module.exports = {
	cooldown: 100,
	help: `Resets the leaderboard for the room. Requires #.`,
	permissions: 'alpha',
	commandFunction: function (Bot, room, time, by, args, client) {
		if (!by.startsWith('#') && !tools.hasPermission(by, 'coder', room)) return Bot.pm(by, 'Access denied.');
		if (!Bot.rooms[room].lb) return Bot.say(room, 'This room doesn\'t have a Leaderboard!');
		if (!Bot.rooms[room].resetLB) {
			Bot.say(room, 'Are you sure you want to reset the leaderboard? If you are, use this again within 10 seconds.');
			Bot.rooms[room].resetLB = true;
			setTimeout(() => delete Bot.rooms[room].resetLB, 10000);
			return;
		}
		Bot.log(JSON.stringify(Bot.rooms[room].lb.users));
		Bot.log(`^ ${Bot.rooms[room].title} points were reset.`);
		Bot.rooms[room].lb.users = {};
		tools.updateLB(room);
		return Bot.say(room, 'Points were reset!');
	}
}