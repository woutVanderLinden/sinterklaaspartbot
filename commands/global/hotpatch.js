module.exports = {
	help: `Hotpatches stuff.`,
	permissions: 'coder',
	commandFunction: function (Bot, room, time, by, args, client) {
		if (!args[0]) return Bot.say(room, unxa);
		Bot.hotpatch(args.join(' '), by).then(out => {
			Bot.say(room, `Successfully hotpatched: ${out}.`);
		}).catch(e => Bot.say(room, `Hotpatch failed: ${e}`));
	}
};
