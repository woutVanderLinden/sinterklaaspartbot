module.exports = {
	cooldown: 1000,
	help: `Allows you to cast a vote for an ongoing Blitz. Syntax: ${prefix}cast (option)`,
	permissions: 'none',
	commandFunction: function (Bot, room, time, by, args, client) {
		if (!Bot.rooms[room].blitzObject) return Bot.say(room, 'No Blitz is currently active.');
		if (Bot.rooms[room].blitzObject.prepping) return Bot.say(room, 'Whoa, hold your horses! The Blitz hasn\'t started, yet!');
		if (!Bot.rooms[room].blitzObject.active) return Bot.say(room, 'No Blitz is currently active.');
		if (!args[0] || args[1]) return Bot.say(room, unxa);
		let vote = args[0].toLowerCase();
		if (!typelist.includes(vote)) return Bot.say(room, 'Invalid type.');
		if (!Bot.rooms[room].blitzObject.autostart) {
			delete Bot.rooms[room].blitzObject;
			return Bot.say(room, `${by.substr(1)} won the Blitz with ${tools.toName(vote)}!`);
		}
		if (!Bot.rooms[room].blitzObject.official) {
			if (Bot.rooms[room].blitzObject.gen == 7) require('./tc7.js').commandFunction(Bot, room, time, Bot.rooms[room].blitzObject.starter, [vote], client);
			else if (Bot.rooms[room].blitzObject.gen == 8) require('./tc.js').commandFunction(Bot, room, time, Bot.rooms[room].blitzObject.starter, [vote], client);
			delete Bot.rooms[room].blitzObject;
		}
		else if (!Bot.rooms[room].blitzObject.official) {
			if (Bot.rooms[room].blitzObject.gen == 7) require('./tc7.js').commandFunction(Bot, room, time, Bot.rooms[room].blitzObject.starter, [vote, 'official'], client);
			else if (Bot.rooms[room].blitzObject.gen == 8) require('./tc.js').commandFunction(Bot, room, time, Bot.rooms[room].blitzObject.starter, [vote, 'official'], client);
			delete Bot.rooms[room].blitzObject;
		}
		return;
	}
}