module.exports = {
	noDisplay: true,
	help: `Starts the 4PM tour in BotDev.`,
	permissions: 'none',
	commandFunction: function (Bot, by, args, client) {
		if (!tools.hasPermission(by, 'beta', 'botdevelopment')) return;
		const botdev = Bot.rooms.botdevelopment;
		if (!botdev.tourPinged) return Bot.pm(by, "Not yet.");
		if (botdev.tourPinged === 1) return Bot.pm(by, 'Sniped!');
		botdev.tourPinged = 1;
		if (!args.length) {
			Bot.say('botdevelopment', '/changerankuhtml %, DkR, <button disabled>4 PM Tour</button>');
			Bot.say('botdevelopment', '/notifyoffrank %');
			Bot.say('botdevelopment', '~tour poll');
		}
	}
};
