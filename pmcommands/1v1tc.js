module.exports = {
	help: `Recreates the 1v1TC GC.`,
	permissions: 'none',
	commandFunction: function (Bot, by, args, client) {
		if (Bot.rooms[tcroom]) return Bot.say(tcroom, `/invite ${by}`);
		if (!Bot.baseAuth[tcroom][toId(by)] || Bot.baseAuth[tcroom][toId(by)] < 4) return Bot.pm(by, 'Access denied.');
		Bot.say('botdevelopment', '/makegroupchat 1v1TC');
		Bot.say(tcroom, `/invite ${by}`);
		client.channels.cache.get('542524011066949633').send(`${by.substr(1)} brought the GC online! https://play.pokemonshowdown.com/groupchat-partbot-1v1tc`);
		let invitees = [].concat(...Object.keys(Bot.baseAuth[tcroom]));
		if (Bot.tcInvitees) invitees.concat(Bot.tcInvitees);
		function inviteTimer (i) {
			if (i >= invitees.length) return;
			Bot.say(tcroom, `/forceroomvoice ${invitees[i]}\n/invite ${invitees[i]}`);
			setTimeout(inviteTimer, 1000, i + 1);
		}
		inviteTimer(0);
		return Bot.say(tcroom, 'UwU');
	}
}