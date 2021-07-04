module.exports = {
	cooldown: 1000,
	help: `Creates a Tournament Blitz with the given options. Syntax: ${prefix}blitz (autostart / official (optional))`,
	permissions: 'beta',
	commandFunction: function (Bot, room, time, by, args, client) {
		return Bot.pm(by, 'This command is under a constrictor! To avoid being swallowed by a snake, please append a ``7`` to the command and try again.');
		if (args[1]) return Bot.say(room, unxa);
		if (args[0].toLowerCase() === 'status' || args[0].toLowerCase() === 'show' || args[0].toLowerCase() === 'view' || args[0].toLowerCase() === 'display') {
			if (!blitzObject[room].active && !blitzObject[room].prepping) return Bot.say(room, 'No Blitz is currently active.');
			if (blitzObject[room].active) return Bot.say(room, 'A Blitz is currently active.');
			return Bot.say(room, 'A Blitz will be starting, soon!');
		}
		if (args[0].toLowerCase() === 'end' || args[0].toLowerCase() == 'cancel') {
			if (!blitzObject[room].active && !blitzObject[room].prepping) return Bot.say(room, "No Blitz is currently active.");
			if (blitzObject[room].prepping) clearTimeout(blitzTimer);
			blitzObject[room].prepping = false;
			blitzObject[room].active = false;
			blitzObject[room].autostart = false;
			blitzObject[room].official = false;
			blitzObject[room].starter = false;
			return Bot.say(room, 'The Blitz has been cancelled.');
		}
		if (blitzObject[room].active || blitzObject[room].prepping) return Bot.say(room, 'A Blitz is already active.');
		if (blitzObject[room]) {
			blitzObject[room] = {
				active: false,
				prepping: false,
				autostart: false,
				official: false,
				starter: false
			}
		}
		if (args[0] && ['as', 'autostart'].includes(toID(args[0]))) blitzObject[room].autostart = true;
		if (args[0] && ['o', 'official'].includes(args[0].toLowerCase())) {
			blitzObject[room].official = true;
			blitzObject[room].autostart = true;
		}
		blitzObject[room].starter = by.substr(1);
		function startBlitz (room) {
			if (!blitzObject[room]) return Bot.say(room, 'Something went wrong.');
			blitzObject[room].prepping = false;
			blitzObject[room].active = true;
			Bot.say(room, '/wall The Blitz has started!');
		}
		let blitzTimer = setTimeout(startBlitz, 10000, room);
		Bot.say(room, '/wall A Blitz will start in 10 seconds! Use ' + prefix + 'cast (type) to cast!');
		blitzTimer;
		blitzObject[room].prepping = true;
	}
}