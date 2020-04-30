module.exports = {
	cooldown: 10,
	help: `Adds a command. Syntax: ${prefix}addcommand (name);(permissions);(room);(cooldown);(help);(output)`,
	permissions: 'admin',
	commandFunction: function (Bot, room, time, by, args, client) {
		let sarg = args.join(' ').split(';');
		if (sarg.length < 4) return Bot.say(room, unxa);
		let newName = tools.commandAlias(toId(sarg.shift()));
		let newPerm = toId(sarg.shift());
		let newRoom = sarg.shift().toLowerCase().replace(/[^a-z0-9-]/g, '');
		if (!newRoom) newRoom = room;
		let newCool = parseInt(sarg.shift().replace(/[^0-9]/g, ''));
		let newHelp = sarg.shift();
		let newOutp = sarg.join(';');
		function addCommandFile (address, content) {
			fs.writeFile(address, content, e => {
				if (e) throw e;
				Bot.say(room, 'The ' + newName + ' command has been added.')
			});
		}
		if (isNaN(newCool)) return Bot.say(room, 'Invalid cooldown time.');
		if (!['admin', 'coder', 'alpha', 'beta', 'gamma', 'locked', 'none'].includes(newPerm)) return Bot.say(room, 'Invalid permissions level.');
		let newData = `module.exports = {\n\tcooldown: ${newCool},\n\thelp: \`${newHelp}\`,\n\tpermissions: \'${newPerm}\',\n\tcommandFunction: function (Bot, room, time, by, args, client) {\n\t\tBot.say(room, \`${newOutp}\`);\n\t}\n}`;
		fs.readdir('./commands/global', (e, files) => {
			if (e) throw e;
			let commands = files.filter(file => file.endsWith('.js')).map(file => file.substr(0, file.length - 3)).filter(file => file === file.toLowerCase());
			if (!newRoom === 'global') {
				fs.readdir('./commands', (err, roomlist) => {
					if (roomlist.includes(room)) {
						fs.readdir('./commands/' + room, (error, rcoms) => {
              if (error) throw error;
							rcoms.filter(file => file.endsWith('.js')).map(file => file.substr(0, file,length - 3)).filter(file => !commands.includes(file)).forEach(file => commands.push(file));
							if (commands.includes(newName)) return Bot.say(room, 'That command already exists.');
							fs.readdir('./commands', (e, rooms) => {
								if (!rooms.includes(room)) {
									fs.mkdir('./commands/' + newRoom, (err) => {
										if (err) throw err;
										addCommandFile('./commands/' + newRoom + '/' + newName + '.js', newData);
										return Bot.log(by.substr(1) + ' added the ' + newName + ' command in the ' + newRoom + ' room.');
									});
								}
							});
						});
					}
				});
			}
			if (commands.includes(newName)) return Bot.say(room, 'That command already exists.');
			fs.readdir('./commands', (e, rooms) => {
				if (!rooms.includes(newRoom) && room !== 'global') {
					fs.mkdir('./commands/' + newRoom, (err) => {
						if (err) throw err;
						addCommandFile('./commands/' + newRoom + '/' + newName + '.js', newData);
						return Bot.log(by.substr(1) + ' added the ' + newName + ' command in the ' + newRoom + ' room.');
					});
				}
				else {
					addCommandFile('./commands/' + newRoom + '/' + newName + '.js', newData);
					return Bot.log(by.substr(1) + ' added the ' + newName + ' command in the ' + newRoom + ' room.');
				}
			});
		});
	}
}
