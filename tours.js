module.exports = function (room, tourData, Bot) {
	if (tourData && tourData[0] === 'create') {
		try {
			let roomData = require(`./data/ROOMS/${room}.json`);
			if (roomData.tour && ['*', '#', '★'].includes(Bot.rooms[room].rank)) {
				setTimeout(() => Bot.say(room, `/tour autostart ${roomData.tour[0]}\n/tour autodq ${roomData.tour[1]}`), roomData.tour[2] || 2000);
				// The timeout is to post these changes _after_ another Bot (looking at you, Jenny) gets a bit overzealous and sets tour times.
			}
		} catch {};
	}
	if (room === 'hindi') {
		if (!tourData) return;
		if (tourData[0] === 'battlestart') {
			Bot.say('', '/j ' + tourData[3]);
			return setTimeout((room, text) => Bot.say(room, text), 1000, tourData[3], `G'luck, nerds.\n/part`);
		}
		else if (tourData[0] === 'update') {
			try {
				let json = JSON.parse(tourData[1]);
				if (!json.bracketData) return;
				if (json.bracketData.type !== 'tree') return;
				if (!json.bracketData.rootNode) return;
				if (json.bracketData.rootNode.state === 'inprogress') Bot.say(room, `/wall Tour finals! <<${json.bracketData.rootNode.room}>>`);
			} catch (e) {
				Bot.log(e);
			}
		}
		else if (tourData[0] === 'end') {
			try {
				let json = JSON.parse(tourData[1]);
				if (json.generator !== 'Single Elimination') return;
				if (json.bracketData.type !== 'tree') return;
				let winners = [];
				let root = json.bracketData.rootNode;
				// The rest of Hindi's tournament points algorithms is redacted. Feel free to write your own.
			} catch (e) {
				Bot.log(e);
			}
		}
	}
}