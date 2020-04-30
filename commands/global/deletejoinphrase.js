module.exports = {
	cooldown: 10,
	help: `Deletes a joinphrase. Syntax: ${prefix}deletejoinphrase (user)`,
	permissions: 'beta',
	commandFunction: function (Bot, room, time, by, args, client) {
    	let name = toId(args.join(''));
		if (!Bot.jps[room] || !Bot.jps[room][name]) return Bot.say(room, `It doesn\'t look like that user has a joinphrase...`);
    	delete Bot.jps[room][name];
    	fs.writeFile(`./data/JPS/${room}.json`, JSON.stringify(Bot.jps[room], null, 2), e => {
    		if (e) return console.log(e);
    		Bot.say(room, 'Joinphrase deleted!');
    	});
	}
}