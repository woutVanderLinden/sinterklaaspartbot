module.exports = {
	cooldown: 1000,
	help: `Creates a groupchat.`,
	permissions: 'coder',
	commandFunction: function (Bot, room, time, by, args, client) {
		if (!args.length) return Bot.say(room, 'No name detected.');
		Bot.say(room, `/makegroupchat ${args.join(' ')}`);
		Bot.say(`groupchat-${toID(Bot.status.nickName)}-${toID(args.join(' '))}`, `/invite ${by}`);
	}
}