module.exports = {
	cooldown: 100,
	help: `DRUMROLL`,
	permissions: 'gamma',
	commandFunction: function (Bot, room, time, by, args, client) {
		Bot.say(room, `**DRRRRRRRRR**\n**Drumroll!**`);
	}
};
