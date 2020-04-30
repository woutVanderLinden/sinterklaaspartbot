module.exports = {
	help: `https://docs.google.com/document/d/1uSRf9zeXVuDtgHMeAVCRKM7Yta-ktUoq2YV8kK-iTL0/edit?usp=sharing`,
	permissions: 'none',
	commandFunction: function (Bot, by, args, client) {
		let help = 'Working on this.';
		if (!args.length) return Bot.pm(by, help);
		let cargs = args.join(' ').split(/,\s*/);
		if (!cargs.length) return Bot.pm(by, help);
		let room = cargs.shift().toLowerCase().replace(/[^a-z0-9-]/g,'');
		if (!Bot.rooms[room]) return Bot.pm(by, 'Invalid room.');
		return require('../commands/global/explodingvoltorb.js').commandFunction(Bot, room, Date.now(), by, cargs.join(',').split(' '), client, true);
	}
}