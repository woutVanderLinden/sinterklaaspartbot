module.exports = {
	help: `Refreshes the editor.`,
	permissions: 'coder',
	commandFunction: function (Bot, by, args, client) {
		if (!websiteLink.includes('glitch.me')) return Bot.pm(by, 'Only works on Glitch.');
		Bot.pm(by, `o/`);
		require('child_process').exec('refresh');
		console.log(`Refreshed!`);
	}
}