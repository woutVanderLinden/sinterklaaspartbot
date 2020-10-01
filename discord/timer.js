module.exports = {
	help: `Sets a timer! Syntax: ${prefix}timer (x) min, (y) sec`,
	pm: true,
	commandFunction: function (args, message, Bot) {
		if (!client.timers) client.timers = {};
		if (!args.length) return message.channel.send(unxa);
		let inp = args.join(' ').split('//');
		let msg = toId(inp.shift()), reason = inp.join('//');
		let hrs = msg.match(/\d+(?:h(?:(?:ou?)?r)?)s?/), min = msg.match(/\d+(?:m(?:in(?:utes?)?)?)/), sec = msg.match(/\d+(?:s(?:ec(?:onds?)?)?)/), ttime = 0;
		if (!hrs && !min && !sec) return message.channel.send('Could not detect a valid time.').then(msg => msg.delete({timeout: 3000}));
		if (hrs) ttime += (parseInt(hrs[0]) * 60 * 60 * 1000);
		if (min) ttime += (parseInt(min[0]) * 60 * 1000);
		if (sec) ttime += (parseInt(sec[0]) * 1000);
		if (!ttime) return message.channel.send("NERD").then(msg => msg.delete({timeout: 3000}));
		if (ttime > 86400000) return message.channel.send("Nothing longer than a day, please.").then(msg => msg.delete({timeout: 3000}));
		clearInterval(client.timers[message.channel.id + message.author.id]);
		if (reason) reason = '(Reason: ' + reason.replace(/@(?:here|everyone)/g, m => m[0] + ' ' + m.slice(1, m.length)).trim() + ')';
		client.timers[message.channel.id + message.author.id] = setTimeout(message => message.reply(`time's up! ${reason || ''}`), ttime, message);
		return message.channel.send(`A timer has been set for ${tools.humanTime(ttime)}.`);
	}
}
