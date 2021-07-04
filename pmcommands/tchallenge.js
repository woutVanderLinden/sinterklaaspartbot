module.exports = {
	help: `Secret.`,
	noDisplay: true,
	permissions: 'none',
	commandFunction: function (Bot, by, args, client) {
		return Bot.pm(by, 'This is over.');
		if (!tools.hasPermission(by, 'coder') && toID(by) !== 'feralflyingfox') return Bot.pm(by, 'Access denied.');
		if (!args[0]) return Bot.pm(by, 'Oi, you forgot to specify the trainer!');
		fs.readFile('./data/DATA/fff.json', 'utf8', (e, file) => {
			if (e) return console.log(e);
			let trainers = JSON.parse(file);
			let trainer = toID(args.join(''));
			if (!trainers[trainer]) return Bot.pm(by, 'Invalid trainer.');
			Bot.setAvatar(trainers[trainer].avatar);
			Bot.pm(by, `/utm ${trainers[trainer].team}`);
			Bot.pm(by, `/challenge ${by}, ${trainers[trainer].tier || '[Gen 8] Custom Game'}`);
		});
	}
}