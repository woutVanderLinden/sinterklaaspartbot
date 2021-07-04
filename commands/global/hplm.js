module.exports = {
	cooldown: 5000,
	noDisplay: true,
	help: `Broadcasts HPL matches.`,
	permissions: 'none',
	commandFunction: function (Bot, room, time, by, args, client) {
		if (!tools.hasPermission(by, 'coder') && !tools.hasPermission(by, 'beta', 'hindi') && !['crowmusic', 'premmalhotra', 'rajshoot', 'shivamo', 'thedarkrising'].includes(toID(by))) return Bot.pm(by, 'Access denied.');
		if (!room.startsWith('battle-')) return Bot.pm(by, "Only for battlerooms.");
		if (Bot.hindi?.hplStored?.[room]) return Bot.say(room, `${Bot.hindi.hplStored[room]} ne already ping kiya tha, lekin shukriya!`);
		client.channels.cache.get("856437495322902538").send(`<@&854676701208641556> ${Bot.rooms[room].title}: https://play.pokemonshowdown.com/${room}`).then(() => {
			if (!Bot.rooms.hindi?.hplStored) Bot.rooms.hindi.hplStored = {};
			Bot.rooms.hindi.hplStored[room] = by.substr(1);
			Bot.say(room, 'Pinged; shukriya!');
		}).catch(Bot.log);
	}
}