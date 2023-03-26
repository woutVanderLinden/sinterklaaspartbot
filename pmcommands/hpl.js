module.exports = {
	help: `HPL links.`,
	permissions: 'none',
	commandFunction: function (Bot, by, args, client) {
		const text = `HPL Finals (II): ${websiteLink}/hpl/week7 | Draft: ${websiteLink}/hpl/draft`;
		Bot.pm(by, text);
	}
};
