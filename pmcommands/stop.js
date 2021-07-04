module.exports = {
	help: `Stops a running timer.`,
	permissions: 'none',
	commandFunction: function (Bot, by, args, client) {
		if (!Bot.pmtimers) return Bot.pm(by, `You don't have any ongoing timers.`);
		if (Bot.pmtimers[toID(by)]) {
			clearTimeout(Bot.pmtimers[toID(by)]);
			delete Bot.pmtimers[toID(by)];
			return Bot.pm(by, 'Stopped timer!');
		}
		else return Bot.pm(by, `You don't have any ongoing timers.`);
	}
}