module.exports = {
  cooldown: 100,
  help: `Links an image in a room.`,
  permissions: 'gamma',
  commandFunction: function (Bot, room, time, by, args, client) {
    if (!args[0]) return Bot.say(room, unxa);
    let line = args.join(' ');
    if (!/^https?:\/\//.test(line)) line = 'http://' + line;
    line = line.split('//');
    let link = line.splice(0, 2).join('//'), text = line.join('//');
    require('request')(link, (error, response, body) => {
      if (error) return Bot.say(room, 'Invalid link.');
      if (/\.(?:png|jpg|gif)$/.test(link)) return Bot.say(room, `/adduhtml LINK, <img src="${link}" width="0" height="0" style="width:auto;height:auto"><br/>${text}`);
      let image = body.match(/<img .*?>/i);
      if (!image) return Bot.say(room, "The given link doesn't have an image!");
      return Bot.say(room, `/adduhtml LINK, ${image[0].substr(0, image[0].length - 1)} width="0" height="0" style="width:auto;height:auto"><br/>${text}`);
    });
  }
}