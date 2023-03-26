module.exports = {
	cooldown: 10,
	// eslint-disable-next-line max-len
	help: `Creates a timer for the given number of seconds / minutes. Syntax: ${prefix}timer (time written out in hours, minutes, and seconds) / ${prefix}timer status / ${prefix}timer stop`,
	permissions: 'none',
	commandFunction: function (Bot, room, time, by, args, client) {
		if (!args.length) return Bot.pm(by, unxa);
		const user = toID(by), rank = tools.hasPermission(by, 'gamma', room);
		const inp = args.join(' ').split('//');
		if (['left', 'count', 'togo', 'longer', 'howmuchlonger', 'ongoing', 'current', 'status'].includes(toID(inp[0]))) {
			if (!Bot.rooms[room].timers || !Bot.rooms[room].timers[user]) return Bot.pm(by, "You do not have an ongoing timer!");
			const timer = Bot.rooms[room].timers[user];
			const timeLeft = tools.toHumanTime(timer._endTime - Date.now());
			if (rank) Bot.say(room, `Your ongoing timer ${timer._reason ? `${timer._reason} ` : ''}will end in ${timeLeft}.`);
			else Bot.pm(by, `Your ongoing timer ${timer._reason ? `${timer._reason} ` : ''}will end in ${timeLeft}.`);
			return;
		}
		if (['stop', 'end', 'remove', 'delete', 'cancel', 'finish'].includes(toID(inp[0]))) {
			if (!Bot.rooms[room].timers || !Bot.rooms[room].timers[user]) return Bot.pm(by, "You do not have an ongoing timer!");
			const timer = Bot.rooms[room].timers[user];
			const timeLeft = tools.toHumanTime(timer._endTime - Date.now());
			if (rank) Bot.say(room, `Your timer ${timer._reason ? `${timer._reason} ` : ''}was ended with ${timeLeft} left.`);
			else Bot.pm(by, `Your timer ${timer._reason ? `${timer._reason} ` : ''}was ended with ${timeLeft} left.`);
			clearTimeout(Bot.rooms[room].timers[user]);
			return;
		}
		const msg = inp.shift();
		let reason = inp.join('//');
		const ttime = tools.fromHumanTime(msg);
		if (!ttime) return Bot.pm(by, "Give me a valid value of time (including units!)");
		if (ttime > 7 * 24 * 60 * 60 * 1000) return Bot.pm(by, "Nothing longer than a week, please.");
		if (reason) reason = '(Reason: ' + reason.replace(/@(?:here|everyone)/g, m => m[0] + ' ' + m.slice(1, m.length)).trim() + ')';
		if (!Bot.rooms[room].timers) Bot.rooms[room].timers = {};
		else clearTimeout(Bot.rooms[room].timers[user]);
		Bot.rooms[room].timers[user] = setTimeout((name, room) => {
			if (rank) Bot.say(room, `${name}, time's up! ${reason || ''}`);
			else Bot.pm(name, `Time's up! ${reason || ''}`);
			delete Bot.rooms[room].timers[user];
		}, ttime, by.substr(1), room);
		Bot.rooms[room].timers[user]._endTime = Date.now() + ttime;
		if (reason) Bot.rooms[room].timers[user]._reason = reason;
		if (tools.hasPermission(by, 'gamma', room)) return Bot.say(room, `A timer has been set for ${tools.toHumanTime(ttime)}.`);
		else return Bot.pm(by, `A timer has been set for ${tools.toHumanTime(ttime)}.`);
	}
};
