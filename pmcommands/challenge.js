module.exports = {
	help: `Challenges a trainer!`,
	permissions: 'coder',
	commandFunction: function (Bot, by, args, client) {
		if (!args[0]) return Bot.pm(by, 'Oi, you forgot to specify the trainer!');
		fs.readFile('./data/BATTLE/trainers.json', 'utf8', (e, file) => {
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