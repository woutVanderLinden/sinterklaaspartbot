module.exports = {
	cooldown: 10000,
	help: `Displays the DPP 2v2 GC link.`,
	permissions: 'none',
	commandFunction: function (Bot, room, time, by, args, client) {
		Bot.say(room, `<<groupchat-2v2-dpp2v2>>`);
	}
};
