module.exports = {
	cooldown: 1000,
	help: `Broadcasts a match as a Hindi PSPL match.`,
	permissions: 'none',
	commandFunction: function (Bot, room, time, by, args, client) {
		// eslint-disable-next-line max-len
		if (!tools.hasPermission(by, 'gamma', 'hindi') && !['cdnthe3rd', 'dugza'].includes(toID(by))) return Bot.pm(by, 'Access denied.');
		if (!room.startsWith('battle-')) return Bot.pm(by, 'This may only be used in a battle room.');
		if (!Bot.PSPL) Bot.PSPL = new Set();
		if (Bot.PSPL.has(room)) return Bot.say(room, 'This was already broadcasted!');
		Bot.PSPL.add(room);
		Bot.say('hindi', `/wall PSPL! ${Bot.rooms[room].title} <<${room}>>`);
		// eslint-disable-next-line max-len
		client.channels.cache.get('837202536149680139').send(`@everyone ${Bot.rooms[room].title} https://play.pokemonshowdown.com/${room}`);
	}
};
