module.exports = {
  cooldown: 1,
  help: `Adds / removes a license to / from the given user. Warning: Using this command prevents future changes to JPs without a license.`,
  permissions: 'beta',
  commandFunction: function (Bot, room, time, by, args, client) {
    if (!args.length) return Bot.pm(by, unxa);
    if (!Bot.rooms[room].shop) Bot.rooms[room].shop = {};
    if (!Bot.rooms[room].shop.jpl) Bot.rooms[room].shop.jpl = [];
    let name = args.join(' ');
    if (Bot.rooms[room].shop.jpl.includes(toId(name))) {
      Bot.rooms[room].shop.jpl.remove(toId(name));
      Bot.log(by.substr(1) + ' delicensed ' + name + ' in ' + Bot.rooms[room].title);
      tools.updateShops(room);
      if (Bot.rooms[room].shop.channel) client.channels.cache.get(Bot.rooms[room].shop.channel).send(` ${name} has been delicensed for a joinphrase.`);
      return Bot.say(room, `${name} has been delicensed for a joinphrase.`);
    }
    Bot.rooms[room].shop.jpl.push(toId(name));
    Bot.log(by.substr(1) + ' licensed ' + name + ' in ' + Bot.rooms[room].title);
    tools.updateShops();
    if (Bot.rooms[room].shop.channel) client.channels.cache.get(Bot.rooms[room].shop.channel).send(` ${name} has been licensed for a joinphrase.`);
    return Bot.say(room, `${name} has been licensed for a joinphrase.`);
  }
}