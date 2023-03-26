module.exports = {
	cooldown: 0,
	// eslint-disable-next-line max-len
	help: `Configures info about your pet(s). Syntax: ${prefix}setpet (entry1): (value1), (entry2): (value2)... [entries can be name/species]`,
	permissions: 'none',
	commandFunction: function (Bot, room, time, by, args, client, isFrom) {
		const DB = Bot.DB('pets');
		const username = toID(by), displayName = by.substr(1);
		const user = DB.get(username) || { pets: {} };
		if (username === 'constructor') return Bot.pm(isFrom, `...can you not, please?`);
		user.name = displayName;
		let pet = {};
		const validEntries = ['name', 'type', 'species'];
		const entries = args
			.join(' ')
			.replace(/[^a-zA-Z0-9,: ]/g, '')
			.split(',')
			.filter(k => k.indexOf(':') >= 0)
			.map(k => k.split(':', 2))
			.filter(k => k[1])
			.map(k => [k[0].toLowerCase().trim(), k[1].trim()]);
		for (const entry of entries) {
			if (!validEntries.includes(entry[0])) {
				return Bot.roomReply(room, by, `Sorry, that wasn't a valid entry! Valid entries are: ${validEntries.join(', ')}`);
			}
			pet[entry[0]] = entry[1];
		}
		if (!pet.name) return Bot.roomReply(room, by, `Which pet are you speaking of?`);
		if (user.pets[toID(pet.name)]) {
			const temp = user.pets[toID(pet.name)];
			Object.entries(pet).forEach(([k, v]) => temp[k] = v);
			pet = temp;
		}
		if (!pet.images) pet.images = [];
		const petTypes = ['bird', 'cat', 'dog', 'fish', 'reptile', 'rodent', 'other'];
		if (pet.type && !petTypes.includes(pet.type)) {
			return Bot.roomReply(room, by, `The only valid types of pets are: ${tools.listify(petTypes)}`);
		}
		if (toID(pet.name) === 'constructor') return Bot.roomReply(room, by, `That is a VERY suspicious snek`);
		if (toID(pet.name) === 'hydro') {
			return Bot.roomReply(room, by, `We all dream of having Hydro as a pet. Who are you, to have done the impossible?`);
		}
		if (toID(pet.name) === 'partbot') return Bot.roomReply(room, by, `I AM NOT YOUR PET! >:I`);
		user.pets[toID(pet.name)] = pet;
		Bot.say(room, `!code ${JSON.stringify(user)}`);
		DB.set(username, user);
		Bot.say(room, `/sendprivatehtmlbox ${isFrom || by}, Your pet has been added/updated (too lazy to check again)`);
	}
};
