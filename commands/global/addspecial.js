module.exports = {
	cooldown: 100,
	help: `Adds special points to a user. Syntax: ${prefix}addspecial (user), (points)`,
	permissions: 'beta',
	commandFunction: function (Bot, room, time, by, args, client) {
    if (!Bot.rooms[room].shop) return Bot.say(room, 'This room doesn\'t have a Shop!');
    let cargs = args.join(' ').split(/\s*,\s*/);
    if (cargs.length !== 2) return Bot.say(room, unxa);
    if (/[a-zA-Z]/.test(cargs[0])) {
      let points = parseInt(cargs[1].replace(/[^0-9-]/g, ''));
      if (isNaN(points)) return Bot.say(room, 'Invalid points.');
      tools.addSpecial(cargs[0], points, room);
      return Bot.say(room, `${cargs[0]} was given ${points} ${points == 1 ? Bot.rooms[room].shop.spc[0] : Bot.rooms[room].shop.spc[1]}.`);
    }
    else if (/[a-zA-Z]/.test(cargs[1])) {
      let points = parseInt(cargs[0].replace(/[^0-9-]/g, ''));
      if (isNaN(points)) return Bot.say(room, 'Invalid points.');
      tools.addSpecial(cargs[1], points, room);
      return Bot.say(room, `${cargs[1]} was given ${points} ${points == 1 ? Bot.rooms[room].shop.spc[0] : Bot.rooms[room].shop.spc[1]}.`);
    }
    return Bot.say(room, 'No user found.');
  }
}