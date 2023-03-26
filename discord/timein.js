module.exports = {
	help: `Does stuff.`,
	pm: true,
	commandFunction: function (args, message, Bot) {
		if (!args.length) args = ['GMT'];
		const tz = require('../data/DATA/timezones.json');
		const zone = tz.find(z => [toID(z.abbr), toID(z.value)].includes(toID(args.join(''))));
		if (!zone) return message.channel.send(`Invalid timezone.`);
		const date = new Date(new Date().toLocaleString('GMT', { timeZone: zone.utc[0] }));
		// eslint-disable-next-line max-len
		message.channel.send(`The time in ${zone.value} is ${date.toLocaleString().split(', ').reverse().map((term, index) => index ? `[${term}]` : term).join(' ')}`);
	}
};
