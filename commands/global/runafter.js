module.exports = {
	cooldown: 0,
	// eslint-disable-next-line max-len
	help: `Runs a command after a specified interval. Syntax: \`\`${prefix}runafter (time in text) // (command and arguments to be run)\`\`. For example, \`\`${prefix}runafter 1 hour // othello new\`\``,
	permissions: 'none',
	commandFunction: function (Bot, room, time, by, args, client) {
		Bot.say(room, `BLANK`);
	}
};
