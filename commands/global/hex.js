module.exports = {
	cooldown: 1,
	help: `Displays the hex colour for a code.`,
	permissions: 'gamma',
	commandFunction: function (Bot, room, time, by, args, client) {
		if (!tools.canHTML(room)) return Bot.pm(by, 'Not a bot here, sorry');
		// eslint-disable-next-line max-len
		Bot.say(room, `/adduhtml HEX,<div style="background-color:${args.join('').startsWith('#') ? '' : '#'}${args.join(' ')};">UwU</div>`);
	}
};
