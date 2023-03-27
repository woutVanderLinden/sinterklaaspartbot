module.exports = function watcher () {
	const watchers = [];
	const watchHots = [{
		path: './data/ALIASES',
		name: 'aliases'
	}, {
		path: './handlers/autores.js',
		name: 'autores'
	}, {
		path: './handlers/chat.js',
		name: 'chat'
	}, {
		path: './handlers/discord_chat.js',
		name: 'discord'
	}, {
		path: './handlers/events.js',
		name: 'events'
	}, {
		path: './data/GAMES',
		name: 'games'
	}, {
		path: './global.js',
		name: 'global'
	}, {
		path: './data/hotpatch.js',
		name: 'hotpatch'
	}, {
		path: './handlers/minorhandler.js',
		name: 'minor'
	}, {
		path: './handlers/pages.js',
		name: 'pages'
	}, {
		path: './handlers/pmhandler.js',
		name: 'pms'
	}, {
		path: './data/ROOMS',
		name: 'rooms'
	}, {
		path: './handlers/router.js',
		name: 'router'
	}, {
		path: './handlers/schedule.js',
		name: 'schedule'
	}, {
		path: './handlers/ticker.js',
		name: 'ticker'
	}, {
		path: './data/tools.js',
		name: 'tools'
	}, {
		path: './handlers/tours.js',
		name: 'tour'
	}, {
		path: './handlers/watcher.js',
		name: 'watcher'
	}];
	watchHots.forEach(watch => watchers.push(fs.watch(watch.path, (event, name) => {
		if (event === 'change') Bot.hotpatch(watch.name, '*Sentinel')
			.then(res => client.channels.cache.get('848835497845194752').send(`Hotpatched: ${res}`))
			.catch(err => client.channels.cache.get('848835497845194752').send(`Unable to hotpatch ${watch.name} because: ${err}`));
	})));
	fs.readdirSync('./commands').forEach(folder => {
		watchers.push(fs.watch(`./commands/${folder}`, (event, name) => {
			if (event === 'change') delete require.cache[require.resolve(`../commands/${folder}/${name}`)];
		}));
	});
	watchers.push(fs.watch('./commands', (eventName, folder) => {
		if (eventName === 'rename') watchers.push(fs.watch(`./commands/${folder}`, (event, name) => {
			if (event === 'change') delete require.cache[require.resolve(`../commands/${folder}/${name}`)];
		}));
	}));
	watchers.push(fs.watch('./pmcommands', (event, name) => {
		if (event === 'change') delete require.cache[require.resolve(`../pmcommands/${name}`)];
	}));
	watchers.push(fs.watch('./discord', (event, name) => {
		if (event === 'change') delete require.cache[require.resolve(`../discord/${name}`)];
	}));
	['bot.js', 'client.js'].forEach(file => watchers.push(fs.watch(file, (event, name) => {
		if (event === 'change') {
			const logChannel = client.channels.cache.get('848835497845194752');
			logChannel.send(`<@!333219724890603520> Changes have been pushed that require a restart`);
		}
	})));
	return {
		watchers: watchers,
		close: () => watchers.forEach(swatch => swatch.close())
	};
	// This is untouched, but I'd highly recommend switching out some of the code here and
	// setting up a small system to detect Git webhooks and automatically hotpatch.
};
