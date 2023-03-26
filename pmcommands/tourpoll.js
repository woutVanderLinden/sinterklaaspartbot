module.exports = {
	help: `Casts a vote for an ongoing tournament poll. Syntax: ${prefix}tourpoll vote (room), (tier)`,
	noDisplay: true,
	permissions: 'none',
	commandFunction: function (Bot, by, args, client) {
		switch (toID(args.shift())) {
			case 'vote': {
				let [room, tier] = args.join(' ').split(', ');
				if (!tier) return Bot.pm(by, unxa);
				room = tools.getRoom(room);
				if (!Bot.rooms.hasOwnProperty(room)) return Bot.pm(by, `Sorry, I'm not in that room!`);
				room = Bot.rooms[room];
				tier = toID(tier);
				if (!room.tourpoll) return Bot.pm(by, `That room doesn't have a tour poll active!`);
				const user = toID(by), exist = room.tourpoll.votes[user];
				const vote = room.tourpoll.options.find(opt => toID(opt) === tier);
				if (!vote) return Bot.pm(by, `Invalid vote.`);
				room.tourpoll.votes[user] = vote;
				return Bot.roomReply(toID(room.title), by, `Your vote has been ${exist ? 'changed' : 'cast'} successfully.`);
			}
			default: return Bot.pm(by, this.help);
		}
	}
};
