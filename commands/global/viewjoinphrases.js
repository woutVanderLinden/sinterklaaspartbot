module.exports = {
	cooldown: 1000,
	help: `Displays a list of all joinphrases in the room. Syntax: ${prefix}viewjoinphrases`,
	permissions: 'beta',
	commandFunction: function (Bot, room, time, by, args, client) {
		if (!Bot.jps[room] || !Object.keys(Bot.jps[room]).length) return Bot.say(room, `It doesn't look ike this room has any joinphrases...`);
		let out = Object.keys(Bot.jps[room]).map((user, index) => `${index + 1})\t${user}${Array.from({length: 21 - user.length}).join('&nbsp;')}: ${Bot.jps[room][user]}`);
		return Bot.sendHTML(by, out.join('<BR/>'));
	}
}