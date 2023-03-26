module.exports = {
	help: `Displays PartBot's GitHub repository.`,
	permissions: 'locked',
	commandFunction: function (Bot, by, args, client) {
		Bot.pm(by, `https://github.com/PartMan7/PartBot`);
	}
};
