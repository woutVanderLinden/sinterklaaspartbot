module.exports = {
	help: `https://docs.google.com/document/d/1uSRf9zeXVuDtgHMeAVCRKM7Yta-ktUoq2YV8kK-iTL0/edit?usp=sharing`,
	noDisplay: true,
	permissions: 'none',
	commandFunction: function (Bot, by, args, client) {
		const help = this.help;
		if (!args.length) return Bot.pm(by, help);
		const cargs = args.join(' ').split(/,\s*/);
		if (!cargs.length) return Bot.pm(by, help);
		const room = tools.getRoom(cargs.shift());
		if (!Bot.rooms[room]) return Bot.pm(by, 'Invalid room.');
		return Bot.commandHandler('explodingvoltorb', by, cargs.join(',').split(' '), room, true);
	}
};
