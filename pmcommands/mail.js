module.exports = {
	help: `Displays the memory usage.`,
	permissions: 'none',
	commandFunction: function (Bot, by, args, client) {
		if (Bot.mailbanned && Bot.mailbanned.includes(toID(by))) {
			return Bot.pm(by, `Sorry, you have been banned from using this feature.`);
		}
		const DB = Bot.DB;
		const cargs = args.join(' ').split(/,/), to = toID(cargs.shift()), content = cargs.join(',').trim();
		if (!to || !content) return Bot.pm(by, `Invalid syntax. Use \`\`${prefix}mail (user), (message)\`\``);
		if (content.length > 240) return Bot.pm(by, `Sorry, messages may only be up to 240 characters long.`);
		if (to === toID(by)) return Bot.pm(by, `NO YOU`);
		if (to === toID(Bot.status.nickName)) return Bot.pm(by, "Wow, you tried to get me to mail myself. Much funny.");
		if (Bot.getRooms(to).length) return Bot.pm(by, `PM them yourself. They're online. o.o`);
		let mails = DB('mails').get(to);
		if (!mails) mails = [];
		if (mails.length >= 16) {
			return Bot.pm(by, `Sorry, the user you tried to mail already has 16 pending mails! Please try again later.`);
		}
		mails.push({
			author: by.substr(1),
			time: Date.now(),
			content: content
		});
		DB('mails').set(to, mails);
		Bot.pm(by, `Your mail has been scheduled for ${to}.`);
	}
};
