module.exports = {
	noDisplay: true,
	help: `Starts the 4PM tour in Hindi.`,
	permissions: 'none',
	commandFunction: function (Bot, by, args, client) {
		if (!tools.hasPermission(by, 'beta', 'hindi')) return;
		const hindi = Bot.rooms.hindi;
		if (!hindi.tourPinged) return Bot.pm(by, "Not yet...");
		if (hindi.tourPinged === 1) return Bot.pm(by, 'Sniped!');
		hindi.tourPinged = 1;
		Bot.say('hindi', '/changerankuhtml %, DkR, <button disabled>4 PM Tour</button>');
		Bot.say('hindi', '/notifyoffrank %');
		Bot.say('hindi', '~tour poll');
		const timeLeft = 60 * 60 * 1000 - (Date.now() + 30 * 60 * 1000) % (60 * 60 * 1000);
		setTimeout(() => {
			Bot.say('hindi', `/notifyrank %, Tour start, Type ~tour start`);
			Bot.say('hindi', `/addrankuhtml %, DkR, <button name="send" value="~tour start">Start!</button>`);
		}, timeLeft);
	}
};
