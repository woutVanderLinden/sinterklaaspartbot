module.exports = {
	help: `Displays the time in the given timezone. Defaults to GMT.`,
	permissions: 'none',
	commandFunction: function (Bot, by, args, client) {
		if (!args.length) args = ['GMT'];
		const tz = require('../data/DATA/timezones.json');
		const zone = tz.find(z => [toID(z.abbr), toID(z.value)].includes(toID(args.join(''))));
		if (!zone) return Bot.pm(by, `Invalid timezone.`);
		const date = new Date(new Date().toLocaleString('GMT', { timeZone: zone.utc[0] }));
		const timeStr = date.toLocaleString().split(', ').reverse().map((term, index) => index ? `[${term}]` : term).join(' ');
		Bot.pm(by, `The time in ${zone.value} is ${timeStr}`);
	}
};
