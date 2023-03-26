module.exports = {
	help: `Translates time A to time B given timezones. For example: \`\`${prefix}whattimeis 6:30 AM IST in EST\`\``,
	permissions: 'none',
	commandFunction: function (Bot, by, args, client) {
		return Bot.commandHandler('whattimeis', by, args, '', true);
	}
};
