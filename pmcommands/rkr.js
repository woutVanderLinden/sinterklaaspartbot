module.exports = {
	noDisplay: true,
	help: `Starts the 9PM tour in Hindi.`,
	permissions: 'none',
	commandFunction: function (Bot, by, args, client) {
		if (!tools.hasPermission(by, 'beta', 'hindi')) return;
		let hindi = Bot.rooms.hindi;
		if (hindi.tourPinged === 1) return Bot.pm(by, 'Sniped!');
		hindi.tourPinged = 1;
		if (!args.length) {
			Bot.say('hindi', '/addrankuhtml %, RkR, <button disabled>9 PM Tour</button>');
			Bot.say('hindi', '/notifyoffrank %');
			Bot.say('hindi', '~tour poll');
			let timeLeft = (60 * 60 * 1000) - (Date.now() + 30 * 60 * 1000) % (60 * 60 * 1000);
			setTimeout(() => {
				Bot.say('hindi', `/notifyrank %, Tour start, Type ~tour start`);
				Bot.say('hindi', `/addrankuhtml %, RkR, <button name="send" value="~tour start">Start!</button>`);
			}, timeLeft);
		}
		else {
			Bot.say('hindi', '/addrankuhtml %, RkR, <button disabled>9 PM Tour</button>');
			Bot.say('hindi', '/notifyoffrank %');
			Bot.say('hindi', `/tour create ${args.join(' ')}, elim`);
			Bot.say('hindi', `/tour scouting disallow`);
		}
	}
}