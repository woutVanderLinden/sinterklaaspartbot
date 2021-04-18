module.exports = {
	help: `Randomly picks between two given options.`,
	guildOnly: "729992843925520474",
	commandFunction: function (args, message, Bot) {
		args = args.join(' ').split(/\s*,\s*/);
		if (args.length !== 2) return message.channel.send('Do options chahiye... \'o.o').then(msg => msg.delete({timeout: 3000}));
		args.sort();
		if (toId(args[0]) === toId(args[1])) return message.channel.send('>khud ke saath');
		if (args.map(toId).includes('binod')) return message.channel.send('Binod.');
		let parity = tools.scrabblify(require('crypto').createHash('md5').update(toId(args.join(',')), 'utf8').digest('hex'));
		let win = parity % 2 ? args[0] : args[1], lose = parity % 2 ? args[1] : args[0], cond = ["aaraam se", "mushkil se", "bade aasaani se", "barely"][parity % 4];
		return message.channel.send(`Mere khayaal se... ${win} ${cond} ${lose} ko haraaenge.`);
	}
}