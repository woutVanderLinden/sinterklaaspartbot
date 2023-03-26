module.exports = {
	cooldown: 0,
	help: `Posts the current raid pool`,
	permissions: 'none',
	commandFunction: function (Bot, room, time, by, args, client) {
		// eslint-disable-next-line max-len
		const images = ['https://cdn.discordapp.com/attachments/803693934139277383/906165674991292516/IMG_1208.png', 'https://cdn.discordapp.com/attachments/803693934139277383/900945591977250846/image0.png', 'https://cdn.discordapp.com/attachments/803693934139277383/897315451690967100/image0.png'];
		const html = `<center><img src="${images.shift()}" height="400" width="414"/></center>`;
		const voice = tools.hasPermission(by, 'gamma', room);
		Bot.say(room, `/${voice ? 'add' : 'sendprivate'}uhtml ${voice ? '' : `${by}, `} RAIDPOOL, ${html}`);
	}
};
