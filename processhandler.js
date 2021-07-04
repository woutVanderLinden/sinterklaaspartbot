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
					process.exit(1);
				});
			}).catch(err => {
				Bot.log(err);
				process.exit(1);
			});
		});
		let standard_input = process.stdin;
		standard_input.setEncoding('utf-8');
		standard_input.on('data', data => {
			try {
				console.log(eval(data));
			} catch(e) {
				console.log(e);
			}
		});
	}
}