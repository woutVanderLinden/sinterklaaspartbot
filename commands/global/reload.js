module.exports = {
    cooldown: 1,
    help: `Reloads a command. Syntax: ${prefix}reload (command) (room [if applicable])`,
    permissions: 'coder',
    commandFunction: function (Bot, room, time, by, args, client) {
        if (!args[0]) return Bot.say(room, unxa);
        let commandName = tools.commandAlias(toId(args.shift()));
        let comRoom = room;
        if (args[0]) comRoom = toId(args.join(''));
        fs.readdir('./commands/global', (e, gcommands) => {
        	if (e) return console.log(e);
        	if (gcommands.includes(commandName + '.js')) {
        		delete require.cache[require.resolve('./' + commandName + '.js')];
        		Bot.log(by.substr(1) + ' reloaded the ' + commandName + ' command.');
        		return Bot.say(room, 'The ' + commandName + ' command has been reloaded.');
        	}
        	fs.readdir('./commands/' + comRoom, (e, files) => {
        		if (e) return Bot.say(room, 'It doesn\'t look like that command exists.');
        		if (files.includes(commandName + '.js')) {
	        		delete require.cache[require.resolve('../' + comRoom + '/' +  commandName + '.js')];
	        		Bot.log(by.substr(1) + ' reloaded the ' + commandName + ' command.');
	        		return Bot.say(room, 'The ' + commandName + ' command has been reloaded.');	
	        	}
	        	return Bot.say(room, 'It doesn\'t look like that command exists.');
        	});
        });
    }
}