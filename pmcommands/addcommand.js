module.exports = {
	help: `Adds a command. Syntax: ${prefix}addcommand (name);(permissions);(help);(output)`,
	permissions: 'admin',
	commandFunction: function (Bot, by, args, client) {
		const sarg = args.join(' ').split(';');
		if (sarg.length < 2) return Bot.pm(by, unxa);
		const newName = tools.commandAlias(toID(sarg.shift()));
		const newPerm = toID(sarg.shift());
		const newHelp = sarg.shift();
		const newOutp = sarg.join(';');
		function addCommandFile (address, content) {
			fs.writeFile(address, content, e => {
				if (e) throw e;
				Bot.pm(by, 'The ' + newName + ' command has been added.');
			});
		}
		if (!['admin', 'coder', 'alpha', 'beta', 'gamma', 'locked', 'none'].includes(newPerm)) {
			return Bot.say(room, 'Invalid permissions level.');
		}
		fs.readdir('./pmcommands', (e, files) => {
			if (e) {
				Bot.pm(by, e.message);
				return Bot.log(e);
			}
			if (files.includes(newName + '.js')) return Bot.pm(by, 'That command already exists!');
			// eslint-disable-next-line max-len
			const newData = `module.exports = {\n\thelp: \`${newHelp}\`,\n\tpermissions: \'${newPerm}\',\n\tcommandFunction: function (Bot, by, args, client) {\n\t\tBot.pm(by, \`${newOutp}\`);\n\t}\n}`;
			addCommandFile(`./pmcommands/${newName}.js`, newData);
		});
	}
};
