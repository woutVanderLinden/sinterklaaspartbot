module.exports = {
  cooldown: 10,
  help: `Creates a timer for the given number of seconds / minutes. Syntax: ${prefix}timer (time in minutes) min or ${prefix}timer (time in seconds) sec`,
  permissions: 'none',
  commandFunction: function (Bot, room, time, by, args, client) {
    if (!Bot.rooms[room].timers) Bot.rooms[room].timers = {};
    let msg = toId(args.join('')), user = toId(by);
    let min = msg.match(/\d+(?:m(?:in(?:utes?)?)?)/), sec = msg.match(/\d+(?:s(?:ec(?:onds?)?)?)/), ttime = 0;
    if (!min && !sec) return Bot.pm(by, 'Could not detect a valid time.');
    if (min) ttime += (parseInt(min[0]) * 60 * 1000);
    if (sec) ttime += (parseInt(sec[0]) * 1000);
    clearInterval(Bot.rooms[room].timers[user]);
    Bot.rooms[room].timers[user] = setTimeout((name, room, rank) => {rank ? Bot.say(room, `${name}, time's up!`) : Bot.pm(name, `Time's up!`); delete Bot.rooms[room].timers[user]}, ttime, by.substr(1), room, tools.hasPermission(by, 'gamma', room));
    if (tools.hasPermission(by, 'gamma', room)) return Bot.say(room, `A timer has been set for ${tools.humanTime(ttime)}.`);
    else return Bot.pm(by, `A timer has been set for ${tools.humanTime(ttime)}.`);
  }
}