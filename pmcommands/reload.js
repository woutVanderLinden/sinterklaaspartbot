module.exports = {
	help: `Reloads the cache for a PM command. Syntax: ${prefix}reload (command)`,
	permissions: 'coder',
	commandFunction: function (Bot, by, args, client) {
		let commandName = tools.pmCommandAlias(args.join(''));
		fs.readdir('./pmcommands', (err, files) => {
			  if (err) {
				    Bot.pm(by, e.message);
				    return Bot.log(e);
			  }
			  if (!files.includes(commandName + '.js')) return Bot.pm(by, `It doesn't look like that command exists...`);
			  delete require.cache[require.resolve(`./${commandName}.js`)]
			  Bot.log(by.substr(1) + ' reloaded the ' + commandName + ' command.');
        return Bot.pm(by, 'The ' + commandName + ' command has been reloaded.');	
		});
	}
}