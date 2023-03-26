module.exports = {
	cooldown: 10,
	help: `Allows you to vote / change your vote for an ongoing poll. Syntax: ${prefix}vote (option)`,
	permissions: 'none',
	commandFunction: function (Bot, room, time, by, args, client) {
		if (!args[0]) return Bot.say(room, unxa);
		if (args[0].toLowerCase() === 'options') return Bot.say(room, 'The options for this poll are ' + tools.listify(typelist.map(type => type.charAt(0).toUpperCase() + type.substr(1)).sort()) + '.');
		const name = toID(by);
		const vType = toID(args.join(''));
		if (!typelist.includes(vType)) return Bot.say(room, 'Invalid vote option.');
		const pollRoom = room;
		if (!pollObject[pollRoom] || !pollObject[pollRoom].active) return Bot.say(room, 'No polls are currently active in this room.');
		if (pollObject[pollRoom].votes[name]) {
			const oldType = pollObject[pollRoom].votes[name];
			pollObject[pollRoom].votes[name] = vType;
			if (oldType === vType) return Bot.say(room, 'You have already voted for ' + vType.charAt(0).toUpperCase() + vType.substr(1) + '!');
		} else pollObject[pollRoom].votes[name] = vType;
		Bot.say(room, 'Your vote has been cast!');
	}
};
