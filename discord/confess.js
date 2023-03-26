module.exports = {
	help: `Posts a confessional.`,
	pm: true,
	commandFunction: function (args, message, Bot) {
		if (message.channel.type !== 'dm') return message.channel.send('This command can only be used in a DM.');
		if (!client.guilds.cache.get('773859244163465223').members.cache.get(message.author.id)) {
			return message.channel.send('You are not in the IIT KGP server!');
		}
		const channel = client.channels.cache.get('781114745713066034');
		const content = args.join(' ').replace(/```/g, '');
		if (content.length > 1800) return message.channel.send('Confessions may have a maximum of 1800 characters.');
		const origindb = require('origindb'), cdb = origindb('data/KGPDB'), confs = cdb('confessions').object();
		if (typeof confs.amt !== 'number') confs.amt = 0;
		id = ++confs.amt;
		message.channel.send(`Your confession has been submitted! ID: ${id}`);
		if (!confs.list) confs.list = {};
		channel.send("```\n" + content + "\n```").then(msg => {
			// eslint-disable-next-line max-len
			channel.send(`${require('crypto').createHash('md5').update(message.author.id.split('').reverse().join('|'), 'utf8').digest('hex').slice(0, 20)} sent the above confession (ID: ${id}). Use \`${prefix}confessionconfirm ${id}\` to confirm.`);
			// Bot.log(`Testing: ${message.author.id} - ${id}`);
			confs.list[id] = {
				content: content,
				author: message.author.id,
				time: Date.now(),
				confirmed: false,
				confirmer: null,
				message: msg.id
			};
			cdb.save();
		});
	}
};
