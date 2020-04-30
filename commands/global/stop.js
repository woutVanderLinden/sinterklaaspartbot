module.exports = {
	cooldown: 1,
	help: `Stops a running timer.`,
	permissions: 'none',
	commandFunction: function (Bot, room, time, by, args, client) {
		if (!Bot.rooms[room].timers) return Bot.pm(by, `You don't have any ongoing timers.`);
    if (Bot.rooms[room].timers[toId(by)]) {
      clearTimeout(Bot.rooms[room].timers[toId(by)]);
      delete Bot.rooms[room].timers[toId(by)];
      return Bot.say(room, 'Stopped timer!');
    }
    else return Bot.say(room, `You don't have any ongoing timers.`);
	}
}