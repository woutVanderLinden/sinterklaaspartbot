module.exports = {
	cooldown: 10,
	help: `Displays the time in the given timezone. Defaults to GMT.`,
	permissions: 'gamma',
	commandFunction: function (Bot, room, time, by, args, client) {
		if (!args.length) args = ['GMT'];
		let tz = require('../../data/DATA/timezones.json'), zone = tz.find(z => [toID(z.abbr), toID(z.value)].includes(toID(args.join(''))));
		if (!zone) return Bot.pm(by, `Invalid timezone.`);
		let date = new Date(new Date().toLocaleString('GMT', {timeZone: zone.utc[0]}));
		Bot.say(room, `The time in ${zone.value} is ${date.toLocaleString().split(', ').reverse().map((term, index) => index ? `[${term}]` : term).join(' ')}`);
	}
}