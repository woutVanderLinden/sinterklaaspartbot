const dayLength = 24 * 60 * 60 * 1000;

function setSchedule () {
	const schedule = {};

	function everyDay (id, time, days, timezoneOffset, callback) {
		if (schedule[id]) {
			clearTimeout(schedule[id]);
			clearInterval(schedule[id]);
		}
		if (!Array.isArray(days)) {
			const aliases = {
				all: [1, 1, 1, 1, 1, 1, 1],
				weekdays: [0, 1, 1, 1, 1, 1, 0],
				weekends: [1, 0, 0, 0, 0, 0, 1]
			};
			const foundAlias = aliases[days];
			if (foundAlias) days = foundAlias;
		}
		const givenTime = time[0] * 60 * 60 * 1000 + time[1] * 60 * 1000 + time[2] * 1000;
		let originDelta = (givenTime - timezoneOffset * 60 * 60 * 1000 + dayLength) % dayLength;
		const nowGMT = new Date(new Date().toUTCString());
		originDelta = (originDelta + dayLength - nowGMT.getTime() % dayLength) % dayLength;
		schedule[id] = setTimeout(() => {
			const interval = () => {
				const TZ = new Date(new Date(new Date().toUTCString()).getTime() + timezoneOffset * 60 * 60 * 1000);
				const day = TZ.getDay();
				if (days[day]) return callback();
			};
			interval();
			schedule[id] = setInterval(interval, dayLength);
		}, originDelta);
		schedule[id]._timerEnd = Date.now() + originDelta;
	}

	everyDay('dkr', [15, 40,  0], 'all', +5.5, () => {
		if (!Bot.rooms.hindi) return;
		// Afternoon randoms
		return Bot.commandHandler('tourpoll', '#PartMan', ['hour'], 'hindi');
	});
	everyDay('rkr', [20, 40,  0], 'weekends', +5.5, () => {
		if (!Bot.rooms.hindi) return;
		// Evening randoms
		return Bot.commandHandler('tourpoll', '#PartMan', ['hour'], 'hindi');
	});
	everyDay('rks', [21,  0,  0], 'weekdays', +5.5, () => {
		if (!Bot.rooms.hindi) return;
		// Evening scheduled
		let tour = [
			null,
			'[Gen 9] Monotype',
			'[Gen 9] OU',
			'[Gen 9] 1v1',
			'[Gen 9] OU',
			['[Gen 9] Ubers', '[Gen 9] Anything Goes'],
			null
		][new Date().getDay()];
		if (Array.isArray(tour)) tour = tour[Math.floor(new Date().getTime() / (7 * dayLength)) % tour.length];
		Bot.say('hindi', `/tour create ${tour}, elim`);
		Bot.say('hindi', `/tour scouting disallow`);
		return;
	});

	everyDay('hindi-automodchat-enable', [0, 0, 0], 'all', +5.5, () => {
		if (!Bot.rooms.hindi) return;
		Bot.say('hindi', '/automodchat 10, +');
	});
	everyDay('hindi-automodchat-disable', [7, 0, 0], 'all', +5.5, () => {
		if (!Bot.rooms.hindi) return;
		Bot.say('hindi', '/automodchat off');
	});

	everyDay('xkcd-kgp', [0, 0, 0], 'all', +5.5, () => {
		const memesChannel = client.channels.cache.get('775774204590686218');
		const command = require('./discord/xkcd.js').commandFunction;
		command([], { channel: memesChannel });
		return;
	});

	// everyDay('aoc-reminder', [0, 0, 0], [1, 1, 1, 1, 1, 1, 1], -5, () => {
	// 	return client.channels.cache.get('773859244600459285').send(`Oi <@&1049554883029778483> nerds it's time`);
	// });

	return schedule;
}

module.exports = setSchedule;
