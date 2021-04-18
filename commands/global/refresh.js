module.exports = {
	cooldown: 1,
	help: `Refreshes the editor.`,
	permissions: 'coder',
	commandFunction: function (Bot, room, time, by, args, client) {
		if (!websiteLink.includes('glitch.me')) return Bot.pm(by, 'Only works on Glitch.');
		Bot.say(room, `o/`);
		require('child_process').exec('refresh');
		console.log(`Refreshed!`);
	}
}