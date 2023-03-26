module.exports = {
	init: function (Bot) {
		process.on('uncaughtException', error => {
			console.log(error);
			Bot.log(error).then(() => {
				Promise.all(Object.values(Bot.streams).map(stream => {
					return new Promise((resolve, reject) => {
						stream.end();
						resolve();
					});
				})).then(() => {
					// process.exit(1);
				});
			}).catch(err => {
				Bot.log(err);
				// process.exit(1);
			});
		});
		// TODO: Use readline
		const stdIn = process.stdin;
		stdIn.setEncoding('utf-8');
		stdIn.on('data', line => {
			try {
				console.log(eval(line));
			} catch (e) {
				console.log(e);
			}
		});
	}
};
