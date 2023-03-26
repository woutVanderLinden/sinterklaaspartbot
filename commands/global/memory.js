module.exports = {
	cooldown: 10000,
	help: `Displays the memory usage.`,
	permissions: 'coder',
	commandFunction: function (Bot, room, time, by, args, client) {
		const usageno = process.memoryUsage().heapUsed / 1024 / 1024;
		const usagestr = usageno.toString();
		const usagearr = usagestr.split('.');
		Bot.say(room, `${usagearr[0]}.${usagearr[1].substr(0, 1)} MB`);
	}
};
