module.exports = function (req, res) {
	const args = req.url.split('/');
	args.shift();
	if (!args[0]) return res.redirect('/home');
	switch (args[0].toLowerCase()) {
		case 'home': {
			fs.readFile('./pages/home.html', 'utf8', (err, file) => {
				if (err) {
					Bot.log(err);
					return res.send('Something went wrong! PartMan has been informed.');
				}
				return res.send(file);
			});
			break;
		}
		case 'hpi': {
			return res.redirect("https://www.youtube.com/watch?v=dQw4w9WgXcQ&feature=youtu.be");
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
			return res.send("Sorry, couldn't find that page you were looking for!");
		}
	}
}
