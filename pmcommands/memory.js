module.exports = {
	help: `Displays the memory usage.`,
	permissions: 'coder',
	commandFunction: function (Bot, by, args, client) {
		const usageno = process.memoryUsage().heapUsed / 1024 / 1024;
		const usage = usageno.toString().split('.');
		Bot.pm(by, `${usage[0]}.${usage[1].substr(0, 1)} MB`);
	}
};
