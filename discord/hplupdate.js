module.exports = {
	help: `Collection of HPL links.`,
	guildOnly: '729992843925520474',
	commandFunction: function (args, message, Bot) {
		if (!message.member.roles.cache.find(r => r.id === '729994253865844806')) {
			return message.channel.send('ACCESS DENIED - why do you know about this :sus:').then(msg => msg.delete({ timeout: 3000 }));
		}
		delete require.cache[require.resolve('../data/DATA/hplsheet.js')];
		require('../data/DATA/hplsheet.js')().then(res => message.channel.send(res.join(', '))).catch(err => {
			Bot.log(err);
			message.channel.send(err.message || err);
		});
	}
};
