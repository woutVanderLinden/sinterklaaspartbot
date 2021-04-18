module.exports = function (command, by, args, room, isPM) {
	if (Bot.rooms[room]?.ignore && !tools.hasPermission(by, 'admin')) return;
	if (tools.blockedCommand(command, room) && !tools.hasPermission(by, 'admin')) return Bot.pm(by, `This command is disabled in ${room}.`);
	let commandReq;
	try {
		commandReq = require(`./commands/${room}/${command}.js`);
	} catch {
		commandReq = require(`./commands/global/${command}.js`);
	} finally {
		if (!commandReq) return Bot.pm(by, `Sorry, doesn't look like that command exists!`);
		if (!tools.hasPermission(by, commandReq.permissions, room)) return Bot.pm(by, "Access denied.");
		try {
			if (cooldownObject[room] && cooldownObject[room][command]) return Bot.pm(by, "Sorry, cooling down.");
			commandReq.commandFunction(Bot, room, Date.now(), by, args, client, isPM);
			tools.setCooldown(command, room, commandReq);
		} catch (err) {
			Bot.pm(by, `Sorry, something went wrong! Error: ${err.message}`);
			Bot.log(err);
		}
	}
}