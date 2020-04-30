module.exports = {
    cooldown: 10,
    help: `Edits a joinphrase. Syntax: ${prefix}editjoinphrase (user), (joinphrase)`,
    permissions: 'beta',
    commandFunction: function (Bot, room, time, by, args, client) {
        let cargs = args.join(' ').split(/,/);
        if (!cargs[1]) return Bot.say(room, unxa);
        let name = toId(cargs.shift());
        if (!Bot.jps[room] || !Bot.jps[room][name]) return Bot.say(room, `It doesn\'t look like that user has a joinphrase... Try using ${prefix}addjoinphrase instead?`);
      if (Bot.rooms[room].shop && Bot.rooms[room].shop.jpl && Bot.rooms[room].shop.jpl.length && !Bot.rooms[room].shop.jpl.includes(name)) return Bot.say(room, `They don't have a license, though. That's illegal. :(`);
        let jp = cargs.join(',');
      if (/(?:kick|punt)s? .*\bSnom\b/i.test(jp)) return Bot.say(room, `That's not acceptable.`);
        if (/^\/[^\/]/.test(jp) && !/^\/mee? /.test(jp)) jp = '/' + jp;
        if (/^!/.test(jp) && !/^!n?da?(?:ta?|s) /.test(tp)) jp = ' ' + jp;
        Bot.jps[room][name] = jp;
        fs.writeFile(`./data/JPS/${room}.json`, JSON.stringify(Bot.jps[room], null, 2), e => {
            if (e) return console.log(e);
            Bot.say(room, 'Joinphrase edited!');
        });
    }
}