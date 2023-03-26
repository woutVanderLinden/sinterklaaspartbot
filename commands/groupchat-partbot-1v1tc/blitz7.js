module.exports = {
	cooldown: 1000,
	help: `Creates a Tournament Blitz with the given options. Syntax: ${prefix}blitz (autostart / official (optional))`,
	permissions: 'beta',
	commandFunction: function (Bot, room, time, by, args, client) {
		if (args[1]) return Bot.say(room, unxa);
		if (!Bot.rooms[room].blitzObject) {
			Bot.rooms[room].blitzObject = {
				active: false,
				prepping: false,
				autostart: false,
				official: false,
				starter: false,
				gen: 0
			};
		}
		if (args[0] && (args[0].toLowerCase() === 'status' || args[0].toLowerCase() === 'show' || args[0].toLowerCase() === 'view' || args[0].toLowerCase() === 'display')) {
			if (!Bot.rooms[room].blitzObject.active && !Bot.rooms[room].blitzObject.prepping) return Bot.say(room, 'No Blitz is currently active.');
			if (Bot.rooms[room].blitzObject.active) return Bot.say(room, 'A Blitz is currently active.');
			return Bot.say(room, 'A Blitz will be starting, soon!');
		}
		if (args[0] && (args[0].toLowerCase() === 'end' || args[0].toLowerCase() == 'cancel')) {
			if (!Bot.rooms[room].blitzObject.active && !Bot.rooms[room].blitzObject.prepping) return Bot.say(room, "No Blitz is currently active.");
			if (Bot.rooms[room].blitzObject.prepping) clearTimeout(Bot.roms[room].blitzTimer);
			delete Bot.rooms[room].blitzObject;
			return Bot.say(room, 'The Blitz has been cancelled.');
		}
		if (Bot.rooms[room].blitzObject.active || Bot.rooms[room].blitzObject.prepping) return Bot.say(room, 'A Blitz is already active.');
		if (Bot.rooms[room].blitzObject) {
			Bot.rooms[room].blitzObject = {
				active: false,
				prepping: false,
				autostart: false,
				official: false,
				starter: false,
				gen: 7
			};
		}
		if (args[0] && ['as', 'autostart'].includes(toID(args[0]))) Bot.rooms[room].blitzObject.autostart = true;
		if (args[0] && ['o', 'official'].includes(args[0].toLowerCase())) {
			Bot.rooms[room].blitzObject.official = true;
			Bot.rooms[room].blitzObject.autostart = true;
		}
		Bot.rooms[room].blitzObject.starter = by.substr(1);
		function startBlitz (room) {
			if (!Bot.rooms[room].blitzObject) return Bot.say(room, 'Something went wrong.');
			Bot.rooms[room].blitzObject.prepping = false;
			Bot.rooms[room].blitzObject.active = true;
			Bot.say(room, '/wall The Blitz has started!');
			delete Bot.rooms[room].blitzTimer;
		}
		Bot.rooms[room].blitzTimer = setTimeout(startBlitz, 1000, room);
		Bot.say(room, '/wall A Blitz will start in 10 seconds! Use ' + prefix + 'cast (type) to cast!');
		Bot.rooms[room].blitzObject.prepping = true;
	}
};
