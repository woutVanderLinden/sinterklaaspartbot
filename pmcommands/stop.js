module.exports = {
	help: `Stops a running timer.`,
	permissions: 'none',
	commandFunction: function (Bot, by, args, client) {
		if (!Bot.pmtimers) return Bot.pm(by, `You don't have any ongoing timers.`);
    if (Bot.pmtimers[toId(by)]) {
      clearTimeout(Bot.pmtimers[toId(by)]);
      delete Bot.pmtimers[toId(by)];
      return Bot.pm(by, 'Stopped timer!');
    }
    else return Bot.say(room, `You don't have any ongoing timers.`);
	}
}