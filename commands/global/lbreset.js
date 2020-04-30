module.exports = {
	cooldown: 10000,
	help: `Resets the leaderboard for the room. Requires #.`,
	permissions: 'alpha',
	commandFunction: function (Bot, room, time, by, args, client) {
		if (!by.startsWith('#') && !tools.hasPermission(by, 'coder', room)) return Bot.pm(by, 'Access denied.');
    if (!Bot.rooms[room].shop) return Bot.say(room, 'This room doesn\'t have a Shop!');
    Bot.log(JSON.stringify(Bot.rooms[room].shop.users));
    Bot.log(`^ ${Bot.rooms[room].title} points were reset.`);
    Bot.rooms[room].shop.users = {};
    tools.updateShops(room);
    return Bot.say(room, 'Points were reset!');
	}
}