module.exports = {
	cooldown: 1000,
	// eslint-disable-next-line max-len
	help: `Sets the ladder prefix; ie, the prefix that either player must have on their username in order for the match to be broadcast. Use \`\`${prefix}ladderprefix disable\`\` to disable.`,
	permissions: 'beta',
	commandFunction: function (Bot, room, time, by, args, client) {
		if (!args.length) {
			const ladderPrefix = Bot.rooms[room]._ladderPrefix;
			if (ladderPrefix) return Bot.say(room, `The current ladder prefix is \`\`${ladderPrefix}\`\`.`);
			else return Bot.say(room, 'There is no required ladder prefix at the moment.');
		}
		const lpre = toID(args.join(''));
		if (lpre === 'disable') {
			delete Bot.rooms[room]._ladderPrefix;
			return Bot.say(room, "The required ladder prefix has been cleared.");
		}
		if (lpre === 'constructor') return Bot.say(room, '...');
		Bot.say(room, `The new ladder prefix is ${Bot.rooms[room]._ladderPrefix = lpre}.`);
	}
};
