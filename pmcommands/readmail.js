module.exports = {
	help: `Reads the latest message in your inbox!`,
	permissions: 'none',
	commandFunction: function (Bot, by, args, client) {
		const user = toID(by);
		const DB = require('origindb')('data/DATA');
		const mails = DB('mails').get(user);
		if (!mails || !mails.length) return Bot.pm(by, "Nope, no unread mails!");
		if (!Bot.lmp) Bot.lmp = {};
		delete Bot.lmp[user];
		let mail = mails.pop();
		const date = new Date(mail.time);
		Bot.pm(by, `At ${date.toLocaleTimeString()} GMT on ${date.toDateString()}, ${mail.author} said: ${mail.content}`);
		DB.save();
	}
}