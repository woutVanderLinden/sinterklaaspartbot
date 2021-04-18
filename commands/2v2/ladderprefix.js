module.exports = {
	cooldown: 1000,
	help: `Sets the ladder prefix; ie, the prefix that either player must have on their username in order for the match to be broadcast. Use \`\`${prefix}ladderprefix disable\`\` to disable.`,
	permissions: 'beta',
	commandFunction: function (Bot, room, time, by, args, client) {
		if (!args.length) return Bot.say(room, Bot.rooms[room]._ladderPrefix ? `The current ladder prefix is \`\`${Bot.rooms[room]._ladderPrefix}\`\`.` : 'There is no required ladder prefix at the moment.');
		let lpre = toId(args.join(''));
		if (lpre === 'disable') {
			delete Bot.rooms[room]._ladderPrefix;
			return Bot.say(room, "The required ladder prefix has been cleared.");
		}
		if (lpre === 'constructor') return Bot.say(room, '...');
		Bot.say(room, `The new ladder prefix is ${Bot.rooms[room]._ladderPrefix = lpre}.`);
	}
}