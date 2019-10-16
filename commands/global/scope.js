module.exports = {
    cooldown: 10000,
    help: `Displays the room(s) where a command can be used. Syntax: ${prefix}scope (command)`,
    permissions: 'none',
    commandFunction: function (Bot, room, time, by, args, client) {
        if (!args[0]) return Bot.say(room, unxa);
        let commandName = tools.commandAlias(toId(args.join('')));
        let commandObj = {};
        fs.readdir('./commands', (e, rooms) => {
        	if (e) return console.log(e);
        	rooms.filter(folder => !folder.includes('.')).forEach(folder => {
        		commandObj[folder] = [];
        		fs.readdirSync('./commands/' + folder).filter(comm => comm.endsWith('.js')).map(comm => comm.substr(0, comm.length - 3)).forEach(comm => commandObj[folder].push(comm));
        	});
        	let foundRooms = [];
        	for (let prop in commandObj) {
        		if (commandObj[prop].includes(commandName)) foundRooms.push(prop);
        	}
        	if (!foundRooms.length) return Bot.say(room, 'It doesn\'t look like the ' + commandName + ' command exists.');
        	if (foundRooms.includes('global')) return Bot.say(room, 'The ' + commandName + ' command is global.');
        	return Bot.say(room, 'The ' + commandName + ' command can be used in ' + tools.listify(foundRooms) + '.');
        });
    }
}