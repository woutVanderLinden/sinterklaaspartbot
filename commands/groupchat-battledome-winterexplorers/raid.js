module.exports = {
	cooldown: 1,
	help: ``,
	permissions: 'none',
	commandFunction: function (Bot, room, time, by, args, client) {
		Bot.say(room, `https://docs.google.com/spreadsheets/d/1RbCfOzQrEeNuzaCNNW_ctWmbYXm2qpIQxakm9oDBBas/edit#gid=0`);
	}
}