module.exports = function (Bot) {
	/*
	* This will run every 20 seconds. Keep this code as efficient as possible.
	*/
	(() => {
		if (!Bot.stopBattles) {
			let games = Object.values(BattleAI.games);
			if (games.filter(game => game.tier === '[Gen 8] Metronome Battle').length < 5) {
				return;
				Bot.say('botdevelopment', `/utm ${Bot.teams['gen8metronomebattle'].random()}`);
				Bot.say('botdevelopment', '/search gen8metronomebattle');
				// if (Bot.ladderLogs) Bot.say('botdevelopment', `Searching...`);
				// Bot.log(Bot.say);
			}
		}
	})();
	if (Bot.rooms.hindi) {
		(() => {
			(() => {
				let users = Bot.rooms.hindi.users;
				let staff = Bot.rooms;
			})();
			let ist = new Date(new Date().toLocaleString('GMT', {timeZone: 'Asia/Kolkata'}));
			let hindi = Bot.rooms.hindi;
			if (hindi.tourPinged || hindi.tourpoll) return;
			let rands = ['[Gen 8] Random Battle', '[Gen 8] Random Doubles', '[Gen 8] Monotype Random Battle', '[Gen 8] Challenge Cup 1v1', '[Gen 8] Hackmons Cup', '[Gen 8] CAP 1v1', '[Gen 7] Random Battle', '[Gen 7] Random Doubles Battle', '[Gen 7] Battle Factory', '[Gen 7] BSS Factory', '[Gen 7] Hackmons Cup', '[Let\'s Go] Random Battle', '[Gen 6] Random Battle', '[Gen 5] Random Battle', '[Gen 4] Random Battle', '[Gen 3] Random Battle', '[Gen 2] Random Battle', '[Gen 1] Random Battle'];
			if (ist.getHours() === 15 && ist.getMinutes() > 40) return Bot.commandHandler('tourpoll', '#PartMan', ['hour'], 'hindi');
			if (![20, 21].includes(ist.getHours())) return;
			let schedule = {
				0: rands,
				1: ['[Gen 8] UU', '[Gen 8] LC'],
				2: '[Gen 8] OU',
				3: ['[Gen 8] 1v1', '[Gen 8] Monotype'],
				4: ['[Gen 8] NFE', '[Gen 8] Battle Stadium Singles'],
				5: '[Gen 8] Doubles OU',
				6: rands
			}
			let tour = schedule[ist.getDay()];
			if (typeof tour === 'string') {
				if ((ist.getHours() === 20 && ist.getMinutes() > 58)/* || (ist.getHours() === 21 && ist.getMinutes() < 2)*/) {
					hindi.tourPinged = true;
					Bot.say('hindi', `/notifyrank %, 9 PM Tour, 9 PM Tour time!`);
					return Bot.say('hindi', `/addrankuhtml %, RkR, <button name="send" value="/msg ${Bot.status.nickName},${prefix}rkr ${tour}">9 PM Tour (${tour})</button>`);
				}
			}
			else if (tour.length < 5) {
				if ((ist.getHours() === 20 && ist.getMinutes() > 58)/* || (ist.getHours() === 21 && ist.getMinutes() < 2)*/) {
					hindi.tourPinged = true;
					tour = tour[Math.floor(ist.getTime() / (7 * 24 * 60 * 60 * 1000)) % tour.length];
					Bot.say('hindi', `/notifyrank %, 9 PM Tour, 9 PM Tour time!`);
					return Bot.say('hindi', `/addrankuhtml %, RkR, <button name="send" value="/msg ${Bot.status.nickName},${prefix}rkr ${tour}">9 PM Tour (${tour})</button>`);
				}
			}
			else if (ist.getHours() === 20 && ist.getMinutes() > 40) Bot.commandHandler('tourpoll', '#PartMan', ['hour'], 'hindi');
		})();
	}
	if (Bot.rooms['2v2']) {
		Bot.say('', '/cmd roomlist gen82v2doubles');
	}
}