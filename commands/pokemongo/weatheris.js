module.exports = {
	cooldown: 0,
	help: `Changes a raid's weather.`,
	permissions: 'none',
	commandFunction: function (Bot, room, time, by, args, client) {
		const user = toID(by);
		const raids = Bot.rooms[room].raids || {};
		if (!Object.keys(raids).length) return Bot.roomReply(room, by, "No raids are active, whoops");
		const host = user;
		if (!raids.hasOwnProperty(host)) return Bot.roomReply(room, by, `B-but you're not hosting?`);
		const raid = raids[host];
		const weathers = {
			"sunny": ["fire", "grass", "ground"],
			"clear": ["fire", "grass", "ground"],
			"partlycloudy": ["normal", "rock"],
			"cloudy": ["fairy", "fighting", "poison"],
			"rain": ["water", "electric", "bug"],
			"rainy": ["water", "electric", "bug"],
			"snow": ["ice", "steel"],
			"fog": ["dark", "ghost"],
			"windy": ["dragon", "flying", "psychic"],
			"unknown": []
		};
		const weather = toID(args.join(''));
		if (!weathers.hasOwnProperty(weather)) {
			// eslint-disable-next-line max-len
			return Bot.roomReply(room, by, `Didn't recognize that weather! The only ones I recognize are: ${tools.listify(Object.keys(weathers).slice(0, -1))}`);
		}
		raid.weather = weather;
		raid.wb = data.pokedex[raid.mon].types.some(t => weathers[raid.weather].includes(toID(t)));
		Bot.say(room, `${by.substr(1)}'s raid weather is now ${args.join(' ')}`);
		raid.HTML();
	}
};
