/* eslint-disable no-unreachable */

module.exports = {
	help: `Begins a match report`,
	pm: true,
	admin: true,
	commandFunction: function (args, message, Bot) {
		return;
		const link = args.join(' ')
			.match(/https?:\/\/play\.pokemonshowdown.com\/(battle-(gen8randombattle-\d{10,11})-[a-z0-9]{31}pw)/);
		if (!link) return message.channel.send(`No valid URL found.`);
		const [url, fullLink, battleRoom] = link;
		if (!Bot.reportMatches) Bot.reportMatches = {};
		if (!Bot.joiningBattles) Bot.joiningBattles = {};
		Bot.joiningBattles[battleRoom] = true;
	}
};
