module.exports = {
	help: `Plays Rock / Paper / Scissors / Spock / Lizard!`,
	permissions: 'none',
	commandFunction: function (Bot, by, args, client) {
		Bot.pm(by, `I chose: ${['Rock', 'Paper', 'Scissors', 'Spock', 'Lizard'].random()}`);
	}
};
