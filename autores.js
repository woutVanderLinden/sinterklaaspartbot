exports.check = function (message, by, room) {
	by = by.substr(1);
	message = message.replace(/\[\[\]\]/g, '');
	if (toID(message.slice(0, -1)) === toID(Bot.status.nickName) && message.substr(-1) === '?') return Bot.pm(by, `Hi, I'm ${Bot.status.nickName}! I'm a Bot by ${config.owner}. My prefix is \`\`${prefix}\`\`. For more information, use \`\`${prefix}help\`\`.`);
	if (toID(message) === toID(Bot.status.nickName + 'forhelp')) return Bot.pm(by, '-_-');
	switch (room) {
		case 'redacted': {
			if (/kicks.*snom/.test(message)) return Bot.say(room, '/me kicks ' + by);
			if (new RegExp(`(?:with|alongside|with.*from|help.*of) ${Bot.status.nickName}$`, 'i').test(message)) return;
			if (toID(message) == 'kden' && toID(by) == 'joltofjustice') return Bot.say(room, 'Kden.');
			// if (toID(by) === 'hydro' && /^(?:|[^\/].* )i(?:'?| a)m .{2,}/i.test(message)) return Bot.pm(by, `Hi, ${message.split(/i(?:'| a)m /i)[1].replace(/[^a-zA-Z0-9]*?$/, '')}! I'm ${Bot.status.nickName}!`);
			return;
			if (/^\/me flee/.test(message)) return Bot.say(room, `/me catches ${by}`);
			if (/^\/me runs/.test(message)) return Bot.say(room, `/me chases ${by} down`);
			if (/^\/me hides/.test(message) && !message.toLowerCase().includes(Bot.status.nickName.toLowerCase())) return Bot.say(room, `/me chains ${by}`);
			if (/^right/.test(message) && toID(by) !== 'partman') return;
			// if (new RegExp(`, ?${Bot.status.nickName}\.?$`, 'i').test(message) && !/\. /.test(message)) return Bot.say(room, message.replace(new RegExp(`, ?${Bot.status.nickName}\.?$`, 'i'), '') + ', ' + by + '.');
			if (new RegExp(`^/me .*${Bot.status.nickName}$`, 'i').test(message) && toID(message).split(toID(Bot.status.nickName)).length == 2) return Bot.say(room, message.replace(new RegExp(`${Bot.status.nickName}`, 'i'), by));
			if (new RegExp(`^${Bot.status.nickName} is a `, 'i').test(message)) return Bot.say(room, 'N-no, you.');
			if (Math.random() < 0.1 && /^(?:|[^\/].* )i(?:'?| a)m .{2,}/i.test(message)) return Bot.say(room, `Hi, ${message.split(/i(?:'| a)m /i)[1].replace(/[^a-zA-Z0-9]*?$/, '')}! I'm ${Bot.status.nickName}!`);
			break;
		}
		case 'boardgames': {
			if ((Math.random() < 0.1 || toID(by) === "mengy") && /^(?:|[^\/].* )i(?:'?| a)m .{2,}/i.test(message)) return Bot.say(room, `Hi, ${message.split(/i(?:'?| a)m /i)[1].replace(/[^a-zA-Z0-9]*?$/, '')}! I'm ${Bot.status.nickName}!`);
			break;
		}
		case 'hplauction': {
			if (/has bought .* for \d+[50]00!/.test(message) && toID(by) === 'scrappie') client.channels.cache.get('855537911566303262').send(message);
			break;
		}
	}
}