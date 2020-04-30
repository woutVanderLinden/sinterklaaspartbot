module.exports = {
	cooldown: 10,
	help: `Adds a joinphrase. Syntax: ${prefix}addjoinphrase (user), (joinphrase)`,
	permissions: 'beta',
	commandFunction: function (Bot, room, time, by, args, client) {
		if (!Bot.jps[room]) {
    		Bot.jps[room] = {};
    		fs.writeFile(`./data/JPS/${room}.json`, '{}', e => {if (e) return console.log(e)});
    	}
    	let cargs = args.join(' ').split(/,/);
    	if (!cargs[1]) return Bot.say(room, unxa);
    	let name = toId(cargs.shift());
      if (Bot.rooms[room].shop && Bot.rooms[room].shop.jpl && Bot.rooms[room].shop.jpl.length && !Bot.rooms[room].shop.jpl.includes(name)) return Bot.say(room, `They don't have a license, though. That's illegal. :(`);
    	if (Bot.jps[room][name]) return Bot.say(room, `That user already has a JP! Use ${prefix}editjoinphrase instead.`);
    	let jp = cargs.join(',');
      if (/(?:kick|punt)s? .*\bSnom\b/i.test(jp)) return Bot.say(room, `That's not acceptable.`);
    	if (/^\/[^\/]/.test(jp) && !/^\/mee? /.test(jp)) jp = '/' + jp;
    	if (/^!/.test(jp) && !/^!n?da?(?:ta?|s) /.test(tp)) jp = ' ' + jp;
    	Bot.jps[room][name] = jp;
    	fs.writeFile(`./data/JPS/${room}.json`, JSON.stringify(Bot.jps[room], null, 2), e => {
    		if (e) return console.log(e);
    		Bot.say(room, 'Joinphrase added!');
    	});
	}
}