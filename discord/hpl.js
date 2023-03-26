module.exports = {
	help: `Collection of HPL links.`,
	pm: true,
	commandFunction: function (args, message, Bot) {
		// eslint-disable-next-line max-len
		message.channel.send(new Discord.MessageEmbed().setTitle('HPL II').setColor('#d2def1').addField('Scores', `http://hindi.partman.co.in/hpl-2021/board`).addField('Draft', `http://hindi.partman.co.in/hpl-2021/draft`).addField('\u200b', '\u200b').addField('Weeks', Array.from({ length: 7 }).map((_, num) => `[${num + 1}](http://hindi.partman.co.in/hpl-2021/week${num + 1})`).join(' ')).addField('Playoffs!', `[Semis](http://hindi.partman.co.in/hpl-2021/semifinals)`));
	}
};
