module.exports = {
	cooldown: 1000,
	help: `Displays the age of a user.`,
	permissions: 'none',
	commandFunction: function (Bot, by, args, client) {
		if (!args[0]) args.push(by);
		require('request')('http://pokemonshowdown.com/users/' + toID(args.join(' ')) + '.json', (err, response, body) => {
			if (err) throw err;
			const userObj = JSON.parse(body);
			if (!userObj.registertime) return Bot.pm(by, toID(args.join(' ')) + ' is not registered.');
			const dtime = Date.now() - 1000 * userObj.registertime;
			Bot.pm(by, userObj.username + ' is ' + tools.toHumanTime(dtime) + ' old.');
		});
	}
};
