module.exports = function (room, time, by, message) {
	if (typeof Bot.jpcool[room] === 'object') Object.keys(Bot.jpcool[room]).forEach(user => Bot.jpcool[room][user][0]++);
	if (message.toLowerCase() === Bot.status.nickName.toLowerCase() + '?') return Bot.pm(by, `Hi, I'm ${Bot.status.nickName}! I'm a Bot by ${config.owner}. My prefix is \`\`${prefix}\`\`. For more information, use \`\`${prefix}help\`\`.`);
	if (toId(message) === toId(Bot.status.nickName + ' for help')) return Bot.pm(by, '-_-');
	if (!Bot.auth.admin.includes(toId(by)) && message.toLowerCase().includes(' punts snom')) return Bot.say(room, `/me punts ${by.substr(1)}`);
	if (tools.hasPermission(by, 'none', room)) require('./autores.js').check(message, by, room);
	if (!message.startsWith(prefix) || (ignoreRooms.includes(room) && !Bot.auth.admin.includes(toId(by)))) return;
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
				case 'object': outp = (commandName == 'eval') ? JSON.stringify(outp) : JSON.stringify(outp, null, 2); break;
				case 'function': outp = outp.toString(); break;
				case 'undefined': outp = 'undefined'; break;
			}
			if (commandName === 'eval' || (!String(outp).split('\n')[1] && String(outp.length > 300))) Bot.say(room, String(outp).replace(/hydrocity/gi,'REDACTED').replaceAll(config.pass, 'UwU'));
			else Bot.say(room, '!code ' + String(outp).replace(/hydrocity/gi,'REDACTED').replaceAll(config.pass, 'UwU'));
		} catch (e) {console.log(e); Bot.say(room, e.message)};
		return;
	}
	const commandFile = commandName + '.js';
	const commandObject = {};
	new Promise((resolve, reject) => {
		fs.readdir('./commands/global', (err, files) => {
			if (err) reject(err);
			commandObject.global = files;
			resolve();
		});
	}).then(() => {
		return new Promise((resolve, reject) => {
			fs.readdir(`./commands/${room}`, (err, files) => {
				if (err) {
					commandObject[room] = [];
					return resolve();
				}
				commandObject[room] = files;
				resolve();
			});
		});
	}).then(() => {
		if (!commandObject[room].includes(commandFile) && !commandObject.global.includes(commandFile)) return Bot.pm(by, "Sorry, it doesn't look that command exists!");
		let loc = room;
		if (!commandObject[room].includes(commandFile)) loc = 'global';
		const cReq = require(`./commands/${loc}/${commandFile}`);
		if (!tools.hasPermission(by, cReq.permissions, room)) return Bot.pm(by, "Access denied.");
		try {
			if (cooldownObject[room] && cooldownObject[room][commandName]) return Bot.pm(by, "Sorry, cooling down.");
			cReq.commandFunction(Bot, room, time, by, args, client);
			tools.setCooldown(commandName, room, cReq);
		} catch (err) {
			Bot.pm(by, `Sorry, something went wrong! Error: ${err.message}`);
			Bot.log(err);
		}
	}).catch(err => {
		Bot.pm(by, `Sorry, something went wrong! Error: ${err.message}`);
		Bot.log(err);
	});
	return;
}
