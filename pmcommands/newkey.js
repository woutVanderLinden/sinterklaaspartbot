module.exports = {
	cooldown: 1,
	help: `Generates a new key for the website. Syntax: ${prefix}newkey (New key, must be numeric. If left blank, randomizes.)`,
	permissions: 'none',
	commandFunction: function (Bot, by, args, client) {
		if (!Bot.keys) return Bot.pm(by, 'Sorry, lemme get stuff set up.');
		let key;
		if (args.length) key = parseInt(args.join('').replace(/[^\d]/g, ''));
		else key = Math.floor(Math.random() * 10000);
		if (isNaN(key)) return Bot.pm(by, 'Invalid key.');
		Bot.keys[toId(by)] = key;
		return Bot.serve(by, 'New key generated!');
	}
}