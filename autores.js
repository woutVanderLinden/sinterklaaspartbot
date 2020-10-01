exports.check = function (message, by, room) {
	by = by.substr(1);
	message = message.replace(/\[\[\]\]/g, '');
	switch (room) {
		case 'botdevelopment': case 'boardgames': {
			if ((Math.random() < 0.31 || toId(by) === "mengy") && /^(?:|[^\/].* )i(?:'?| a)m .{2,}/i.test(message)) return Bot.say(room, `Hi, ${message.split(/i(?:'?| a)m /i)[1].replace(/[^a-zA-Z0-9]*?$/, '')}! I'm ${Bot.status.nickName}!`);
			break;
		}
	}
}
