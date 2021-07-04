module.exports = {
	help: `Displays the page link for RegEx hunts.`,
	permissions: 'none',
	commandFunction: function (Bot, by, args, client) {
		Bot.pm(by, ` http://partbot.partman.co.in/regexhunts`);
	}
}