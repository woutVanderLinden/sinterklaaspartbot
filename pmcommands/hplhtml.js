module.exports = {
	noDisplay: true,
	help: `HPL HMTL.`,
	permissions: 'none',
	commandFunction: function (Bot, by, args, client) {
		const html = fs.readFile('./data/DATA/hplboard.html', 'utf8', (err, html) => {
			if (err) Bot.pm(by, err);
			if (Bot.rooms.hindi?.users.find(u => toID(u) === toID(by))) Bot.say('hindi', `/sendprivatehtmlbox ${by}, ${html}`);
			else Bot.sendHTML(by, html);
		});
	}
};
