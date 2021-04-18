module.exports = {
	help: `Displays the time in the given timezone. Defaults to GMT.`,
	permissions: 'none',
	commandFunction: function (Bot, by, args, client) {
		if (!args.length) args = ['GMT'];
		let tz = require('../data/DATA/timezones.json'), zone = tz.find(z => [toId(z.abbr), toId(z.value)].includes(toId(args.join(''))));
		if (!zone) return Bot.pm(by, `Invalid timezone.`);
		let date = new Date(new Date().toLocaleString('GMT', {timeZone: zone.utc[0]}));
		Bot.pm(by, `The time in ${zone.value} is ${date.toLocaleString().split(', ').reverse().map((term, index) => index ? `[${term}]` : term).join(' ')}`);
	}
}