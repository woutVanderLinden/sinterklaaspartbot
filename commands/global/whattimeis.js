module.exports = {
	cooldown: 100,
	help: `Translates time A to time B given timezones. For example: \`\`${prefix}whattimeis 6:30 AM IST in EST\`\``,
	permissions: 'none',
	commandFunction: function (Bot, room, sentTime, by, args, client, isPM) {
		const input = args.join(' ');
		if (!input) return Bot.pm(by, unxa);
		// eslint-disable-next-line max-len
		const match = input.match(/(?: ?is ?)?(\d{1,2}(?:\:\d{2}){0,2})(?: ?o['"`’ʼ]? ?clock)? ?([ap]m)?(?: ([a-z]{3,4}?))? (?:in|to) ([a-z]{3,4}?)/i);
		// TODO: Add GMT±\d+ to parsing
		if (!match) {
			// eslint-disable-next-line max-len
			return Bot.pm(by, `Hiya; I wasn't able to parse your sentence! If you feel it should've been valid, please contact PartMan.`);
		}
		let time = 0; // (0 @ 12:00:00 AM)
		let [, timestamp, meridian, baseZone, targetZone] = match;
		if (!baseZone) baseZone = 'GMT';
		[baseZone, targetZone] = [baseZone.toLowerCase(), targetZone.toLowerCase()];
		const tz = require('../../data/DATA/timezones.json');
		baseZone = tz.find(z => [z.abbr, z.value].map(toID).includes(baseZone));
		targetZone = tz.find(z => [z.abbr, z.value].map(toID).includes(targetZone));
		if (!baseZone || !targetZone) {
			return Bot.pm(by, `Unrecognized timezone: Could not find ${baseZone ? `target` : `specified base`} time zone`);
		}
		let tfh = 0;
		if (!meridian) tfh = 1;
		meridian = meridian ? meridian.toLowerCase() : 'am';
		const timesplit = timestamp.split(':');
		if (timesplit[0] === '12') timesplit[0] = '0';
		if (meridian === 'pm') time += 12 * 60 * 60 * 1000;
		time += timesplit.reduce((acc, val, index) => {
			return acc + ~~toID(val) * [60, 60, 1000].slice(index).reduce((a, b) => a * b, 1);
		}, 0);
		const today = new Date();
		function getTimeZoneOffset (timeZone) {
			return new Date(today.toLocaleString('GMT', { timeZone: timeZone.utc[0] })) - today;
		}
		const delta = getTimeZoneOffset(targetZone) - getTimeZoneOffset(baseZone);
		const targetTimeval = time + delta;
		const targetSeconds = Math.round(targetTimeval / 1000);
		let relFlag;
		const dayLength = 24 * 60 * 60 * 1;
		function formatSeconds (targetSeconds) {
			if (targetSeconds < 0) {
				relFlag = 0;
				targetSeconds += dayLength;
			} else if (targetSeconds > dayLength) {
				relFlag = 2;
				targetSeconds -= dayLength;
			} else relFlag = 1;
			const timeVals = [];
			timeVals.unshift(Math.floor(targetSeconds / (60 * 60)));
			targetSeconds -= timeVals[0] * (60 * 60);
			timeVals.unshift(Math.floor(targetSeconds / 60));
			targetSeconds -= timeVals[0] * 60;
			timeVals.unshift(Math.floor(targetSeconds));
			timeVals.reverse();
			const tfht = timeVals.map((num, i) => String(num).padStart(i ? 2 : 1, '0')).join(':');
			let targetMer = 'AM';
			if (timeVals[0] > 12) {
				targetMer = 'PM';
				timeVals[0] -= 12;
			} else if (timeVals[0] === 12) {
				targetMer = 'PM';
			} else if (timeVals[0] === 0) {
				timeVals[0] = 12;
			}
			const tht = `${timeVals.map((num, i) => String(num).padStart(i ? 2 : 1, '0')).join(':')} ${targetMer}`;
			return [tht, tfht];
		}
		const baseTime = formatSeconds(Math.round(time / 1000)), targetTime = formatSeconds(targetSeconds);
		const dateOffset = [' on the previous day.', '.', ' on the next day.'][relFlag];
		const output = `${baseTime[tfh]} in ${baseZone.value} is ${targetTime[tfh]} in ${targetZone.value}${dateOffset}`;
		const cleaned = output.replace(/(?::00)+(?= )/g, '');
		if (isPM) Bot.pm(by, cleaned);
		else if (tools.hasPermission(by, room, 'gamma')) Bot.say(room, cleaned);
		else Bot.roomReply(room, by, cleaned);
	}
};
