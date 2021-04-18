module.exports = function (room, time, by, message) {
	if (typeof Bot.jpcool[room] === 'object') Object.keys(Bot.jpcool[room]).forEach(user => Bot.jpcool[room][user][0]++);
	if (tools.hasPermission(by, 'none', room)) require('./autores.js').check(message, by, room);
	if (ignoreRooms.includes(room) && !Bot.auth.admin.includes(toId(by))) return;
	if (!message.startsWith(prefix)) return;
	if (message === `${prefix}eval 1`) return Bot.say(room, '1');
	let args = message.substr(prefix.length).split(' ');
	if (args[0].toLowerCase() == 'constructor') return Bot.say(room, `/me constructs a constrictor to constrict ${by.substr(1)}`);
	const commandName = tools.commandAlias(args.shift().toLowerCase());
	if (!commandName) return;
	if (['eval','output'].includes(commandName)) {
		if (!tools.hasPermission(toId(by), 'admin')) return Bot.pm(by, 'Access denied.');
		try {
			let outp = eval(args.join(' '));
			switch (typeof outp) {
				case 'object': outp = (commandName == 'eval') ? JSON.stringify(outp) : util.inspect(outp); break;
				case 'function': outp = outp.toString(); break;
			}
			if (commandName === 'eval') Bot.say(room, String(outp).replaceAll(config.pass, 'UwU'));
			else Bot.say(room, '!code ' + String(outp).replaceAll(config.pass, 'UwU'));
		} catch (e) {
			Bot.log(e);
			Bot.say(room, e.message);
		};
		return;
	}
	return Bot.commandHandler(commandName, by, args, room);
}