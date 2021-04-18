module.exports = {
	cooldown: 1000,
	help: `Sets the ladder reporting floor; ie, the minimum Elo required to broadcast a match in the room.`,
	permissions: 'beta',
	commandFunction: function (Bot, room, time, by, args, client) {
		if (!args.length) return Bot.say(room, `The current ladder floor is ${Bot.rooms[room]._ladderFloor || 1000} Elo.`);
		let amt = parseFloat(args.join(' '));
		if (!amt) {
			delete Bot.rooms[room]._ladderFloor;
			return Bot.say(room, 'The rating floor on ladder matches has been cleared.');
		}
		Bot.say(room, `The ladder floor has been set to ${Bot.rooms[room]._ladderFloor = amt} Elo - matches below this will not be broadcasted.`);
	}
}