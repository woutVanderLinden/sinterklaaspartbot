module.exports = {
  help: `Creates a timer for the given number of seconds / minutes. Syntax: ${prefix}timer (time in minutes) min or ${prefix}timer (time in seconds) sec`,
  permissions: 'none',
  commandFunction: function (Bot, by, args, client) {
    if (!Bot.pmtimers) Bot.pmtimers = {};
    let msg = toId(args.join('')), user = toId(by);
    let min = msg.match(/\d+(?:m(?:in(?:utes?)?)?)/), sec = msg.match(/\d+(?:s(?:ec(?:onds?)?)?)/), ttime = 0;
    if (!min && !sec) return Bot.pm(by, 'Could not detect a valid time.');
    if (min) ttime += (parseInt(min[0]) * 60 * 1000);
    if (sec) ttime += (parseInt(sec[0]) * 1000);
    clearInterval(Bot.pmtimers[user]);
    Bot.pmtimers[user] = setTimeout(name => {Bot.pm(name, `Time's up!`); delete Bot.pmtimers[user]}, ttime, by.substr(1));
    return Bot.pm(by, `A timer has been set for ${tools.humanTime(ttime)}.`);
  }
}