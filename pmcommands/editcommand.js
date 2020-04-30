module.exports = {
	help: `Edits a command using a pastebin link. Syntax: ${prefix}editcommand (command name), (room), (pastebin link)`,
	permissions: 'admin',
	commandFunction: function (Bot, by, args, client) {
		Bot.pm(by, ``);
	}
}