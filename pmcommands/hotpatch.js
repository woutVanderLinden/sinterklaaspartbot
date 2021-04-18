module.exports = {
	cooldown: 1,
	help: `Hotpatches stuff.`,
	permissions: 'coder',
	commandFunction: function (Bot, by, args, client) {
		if (!args[0]) return Bot.pm(by, unxa);
		Bot.hotpatch(args.join(' '), by).then(out => Bot.pm(by, `Successfully hotpatched: ${out}.`)).catch(e => Bot.pm(by, `Hotpatch failed: ${e}`));
	}
}