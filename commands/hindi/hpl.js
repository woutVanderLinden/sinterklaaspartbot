module.exports = {
	cooldown: 1,
	help: `HPL ka score dikhaata hai`,
	permissions: 'gamma',
	commandFunction: function (Bot, room, time, by, args, client) {
		const html = fs.readFile('./data/DATA/hplboard.html', 'utf8', (err, html) => {
			if (err) Bot.pm(by, err);
			Bot.say(room, `/adduhtml HPLBOARD, ${html}`);
		});
	}
};
