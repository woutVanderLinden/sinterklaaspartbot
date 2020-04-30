exports.getRoutes = function (app) {
	app.get('/', (req, res) => {
		fs.readFile('./pages/home.html', 'utf8', (err, file) => {
			if (err) {
				console.log(err);
				return res.send('No page found.');
			}
			return res.send(file);
		});
	});
	app.get('/hypnosis', (req, res) => {
		fs.readFile('./pages/hypnosis.html', 'utf8', (err, file) => {
			if (err) {
				console.log(err);
				return res.send('No page found.');
			}
			return res.send(file);
		});
	});
	app.get('/render', (req, res) => {
		fs.readFile('./render.html', 'utf8', (err, file) => {
			if (err) {
				console.log(err);
				return res.send('No page found.');
			}
			return res.send(file);
		});
	});
  });
}
