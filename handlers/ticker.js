module.exports = function (Bot) {
	// This will run every 20 seconds. Keep this code as efficient as possible.

	// Auto-ladder for the Metronome ladder
	if (config.autoLadder) {
		const games = Object.values(BattleAI.games);
		if (games.filter(game => game.tier === '[Gen 8] Metronome Battle').length < 5) {
			Bot.say('botdevelopment', `/utm ${Bot.teams['gen8metronomebattle'].random()}`);
			Bot.say('botdevelopment', '/search gen8metronomebattle');
		}
	}

	// Pulling battles for 2v2
	/*
	if (Bot.rooms['2v2']) {
		Bot.say('', '/cmd roomlist gen92v2doubles');
	}
	*/
	// Disabled for now
};
