module.exports = {
	cooldown: 1000,
	help: `Displays a list of all joinphrases in the room. Syntax: ${prefix}viewjoinphrases`,
	permissions: 'beta',
	commandFunction: function (Bot, room, time, by, args, client) {
		if (!Bot.jps[room] || !Object.keys(Bot.jps[room]).length) {
			return Bot.say(room, `It doesn't look ike this room has any joinphrases...`);
		}
		const info = Object.entries(Bot.jps[room]).map(([name, jp]) => [tools.colourize(name), tools.escapeHTML(jp)]);
		const html = `<table>${info.map(row => `<tr>${row.map(term => `<td>${term}</td>`).join('')}</tr>`).join('')}</table>`;
		return Bot.sendHTML(by, html);
	}
};
