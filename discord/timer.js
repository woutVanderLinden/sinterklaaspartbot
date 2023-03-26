module.exports = {
	help: `Sets a timer! Syntax: ${prefix}timer (x) min, (y) sec`,
	pm: true,
	commandFunction: function (args, message, Bot) {
		if (!args.length) return message.channel.send(unxa).then(msg => msg.delete({ timeout: 3000 }));
		const user = message.author.id;
		const inp = args.join(' ').split('//');
		if (['left', 'count', 'togo', 'longer', 'howmuchlonger', 'ongoing', 'current', 'status'].includes(toID(inp[0]))) {
			if (!message.channel.timers || !message.channel.timers[user]) {
				return message.channel.send("You do not have an ongoing timer!").then(msg => msg.delete({ timeout: 3000 }));
			}
			const timer = message.channel.timers[user];
			// eslint-disable-next-line max-len
			message.channel.send(`Your ongoing timer ${timer._reason ? `${timer._reason} ` : ''}will end in ${tools.toHumanTime(timer._endTime - Date.now())}.`);
			return;
		}
		if (['stop', 'end', 'remove', 'delete', 'cancel', 'finish'].includes(toID(inp[0]))) {
			if (!message.channel.timers || !message.channel.timers[user]) {
				return message.channel.send("You do not have an ongoing timer!").then(msg => msg.delete({ timeout: 3000 }));
			}
			const timer = message.channel.timers[user];
			// eslint-disable-next-line max-len
			message.channel.send(`Your timer ${timer._reason ? `${timer._reason} ` : ''}was ended with ${tools.toHumanTime(timer._endTime - Date.now())} left.`);
			clearTimeout(message.channel.timers[user]);
			return;
		}
		const msg = inp.shift();
		let reason = inp.join('//');
		const ttime = tools.fromHumanTime(msg);
		if (!ttime) return message.channel.send("YOU IS NERD").then(msg => msg.delete({ timeout: 3000 }));
		if (ttime > 7 * 24 * 60 * 60 * 1000) {
			return message.channel.send("Nothing longer than a week, please.").then(msg => msg.delete({ timeout: 3000 }));
		}
		if (reason) {
			reason = '(Reason: ' + reason.replace(/@(?:here|everyone)/g, m => m[0] + '\u200b' + m.slice(1, m.length)).trim() + ')';
		}
		if (!message.channel.timers) message.channel.timers = {};
		else clearTimeout(message.channel.timers[user]);
		message.channel.timers[user] = setTimeout(() => {
			message.reply(`time's up! ${reason || ''}`);
			delete message.channel.timers[user];
		}, ttime);
		message.channel.timers[user]._endTime = Date.now() + ttime;
		if (reason) message.channel.timers[user]._reason = reason;
		message.channel.send(`A timer has been set for ${tools.toHumanTime(ttime)}.`);
	}
};
