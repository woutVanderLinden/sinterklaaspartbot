module.exports = {
	cooldown: 10000,
	help: `SNOM!`,
	permissions: 'gamma',
	commandFunction: function (Bot, room, time, by, args, client) {
		Bot.say(room, `/adduhtml SNOM,<CENTER><IMG src="https://media.discordapp.net/attachments/652695616610238464/656154115080060938/1573694833723.png" height="100" width="100"></CENTER>`);
	}
}