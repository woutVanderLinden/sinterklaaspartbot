module.exports = {
	// eslint-disable-next-line max-len
	help: `Creates a timer for the given number of seconds / minutes. Syntax: ${prefix}timer (time in minutes) min or ${prefix}timer (time in seconds) sec`,
	permissions: 'none',
	commandFunction: function (Bot, by, args, client) {
		if (!args.length) return Bot.pm(by, unxa);
		if (!Bot.pmtimers) Bot.pmtimers = {};
		const user = toID(by);
		const inp = args.join(' ').split('//');
		if (['left', 'count', 'togo', 'longer', 'howmuchlonger', 'ongoing', 'current', 'status'].includes(toID(inp[0]))) {
			if (!Bot.pmtimers || !Bot.pmtimers[user]) return Bot.pm(by, "You do not have an ongoing timer!");
			const timer = Bot.pmtimers[user];
			// eslint-disable-next-line max-len
			Bot.pm(by, `Your ongoing timer ${timer._reason ? `${timer._reason} ` : ''}will end in ${tools.toHumanTime(timer._endTime - Date.now())}.`);
			return;
		}
		if (['stop', 'end', 'remove', 'delete', 'cancel', 'finish'].includes(toID(inp[0]))) {
			if (!Bot.pmtimers || !Bot.pmtimers[user]) return Bot.pm(by, "You do not have an ongoing timer!");
			const timer = Bot.pmtimers[user];
			// eslint-disable-next-line max-len
			Bot.pm(by, `Your timer ${timer._reason ? `${timer._reason} ` : ''}was ended with ${tools.toHumanTime(timer._endTime - Date.now())} left.`);
			clearTimeout(Bot.pmtimers[user]);
			return;
		}
		const msg = inp.shift();
		let reason = inp.join('//');
		const ttime = tools.fromHumanTime(msg);
		if (!ttime) return Bot.pm(by, "Give me a valid value of time (including units!)");
		if (ttime > 7 * 24 * 60 * 60 * 1000) return Bot.pm(by, "Nothing longer than a week, please.");
		if (reason) reason = '(Reason: ' + reason.replace(/@(?:here|everyone)/g, m => m[0] + ' ' + m.slice(1, m.length)).trim() + ')';
		if (!Bot.pmtimers) Bot.pmtimers = {};
		else clearTimeout(Bot.pmtimers[user]);
		Bot.pmtimers[user] = setTimeout((name) => {
			Bot.pm(by, `${name}, time's up! ${reason || ''}`);
			delete Bot.pmtimers[user];
		}, ttime, by.substr(1));
		Bot.pmtimers[user]._endTime = Date.now() + ttime;
		if (reason) Bot.pmtimers[user]._reason = reason;
		return Bot.pm(by, `A timer has been set for ${tools.toHumanTime(ttime)}.`);
	}
};
