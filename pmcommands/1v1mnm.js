module.exports = {
	help: `Recreates the 1v1 MnM GC.`,
	noDisplay: true,
	permissions: 'none',
	commandFunction: function (Bot, by, args, client) {
		if (Bot.rooms['groupchat-partbot-1v1mnm']) return Bot.say('groupchat-partbot-1v1mnm', `/invite ${by}`);
		if (!Bot.baseAuth['groupchat-partbot-1v1mnm'][toID(by)] || Bot.baseAuth['groupchat-partbot-1v1mnm'][toID(by)] < 4) return Bot.pm(by, 'Access denied.');
		Bot.say('botdevelopment', '/makegroupchat 1v1 MnM');
		Bot.say('groupchat-partbot-1v1mnm', `/invite ${by}`);
		client.channels.cache.get('713969903979331655').send(`${by.substr(1)} brought the GC online! https://play.pokemonshowdown.com/groupchat-partbot-1v1mnm`);
		let invitees = [].concat(...Object.keys(Bot.baseAuth['groupchat-partbot-1v1mnm']));
		if (Bot.tcInvitees) invitees.concat(Bot.tcInvitees);
		function inviteTimer (i) {
			if (i >= invitees.length) return;
			Bot.say('groupchat-partbot-1v1mnm', `/forceroomvoice ${invitees[i]}\n/invite ${invitees[i]}`);
			setTimeout(inviteTimer, 1000, i + 1);
		}
		if (!args.length) inviteTimer(0);
		return Bot.say('groupchat-partbot-1v1mnm', 'UwU');
	}
}