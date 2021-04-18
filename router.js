module.exports = {
	get: function (req, res) {
		const args = req.url.split('/');
		args.shift();
		if (!args[0]) return res.redirect('/home');
		if (Bot.AFD && Math.random() < 0.3) return res.redirect(`https://www.youtube.com/watch?v=dQw4w9WgXcQ&feature=youtu.be`);
		switch (args[0].toLowerCase()) {
			case 'othello': {
				if (!args[1]) return res.send("Err, it looks like you forgot to specify the game code, sorry.");
				if (/[^A-Za-z0-9_-]/.test(args[1])) return res.send("Invalid game code.");
				fs.readFile('./pages/othello.html', 'utf8', (err, file) => {
					if (err) {
						Bot.log(err);
						return res.send('Something went wrong! PartMan has been informed.');
					}
					return res.send(file.replace('##GAME_STR##', args[1]));
				});
				break;
			}
			case 'quotes': {
				if (!args[1]) return res.send(`Hi, you'll need to specify the room! Simply go to ${websiteLink}/quotes/(room)!`);
				let room = args.slice(1).join('').toLowerCase().replace(/[^a-z0-9-]/g, '');
				fs.readdir(`./data/QUOTES`, (e, files) => {
					if (e) {
						Bot.log(e);
						return res.send(e.message);
					}
					if (!files.includes(`${room}.json`)) return res.send(`Sorry, don't have any quotes in that room!`);
					fs.readFile(`./data/QUOTES/${room}.json`, 'utf8', (err, dt) => {
						if (err) {
							Bot.log(e);
							return res.send(e.message);
						}
						fs.readFile(`./pages/quotes.html`, 'utf8', (err, html) => {
							if (err) return res.send(err.message);
							return res.send(Bot.temp = html.replace('###QUOTEINFO###', JSON.parse(dt).map((q, i) => `			<span class="num">${i + 1})</span>\n			<div class="quote">\n				${tools.quoteParse(q)}\n			</div>`).join('\n			<hr />\n')));
						});
					});
				});
				break;
			}
			case 'user': {
				const user = args[1], key = args[2];
				if (!Bot.keys[user]) return res.send("Sorry, I don't have any pages for that user.");
				if (Bot.keys[user] !== parseInt(key)) return res.send("Sorry, invalid key!");
				return res.send(`<head>\n\t<title>PartBot</title>\n\t<link rel="icon" href="/public/icon.png">\n</head>\n<body>\t${Bot.pageData[user]}</body>`);
			}
			case 'public': {
				try {
					res.sendFile(`${__dirname}/${args.join('/').replace(/(?:"|%22)$/, '')}`);
				} catch (e) {
					// Bot.log(e);
				}
				break;
			}
			default: {
				return res.send("Sorry, couldn't find the page you were looking for!");
			}
		}
	},
	post: function (req, res) {
		const args = req.url.split('/');
		args.shift();
		switch (args[0].toLowerCase()) {
			default: return res.send(`POST-MORTEM`);
		}
	}
}