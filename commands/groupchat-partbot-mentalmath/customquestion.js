module.exports = {
	cooldown: 1000,
	help: `Creates a question from the supplied options. Options are to be separated by a comma, and formatted as \`\`(char)(first)-(second)\`\`. char may be:  A - addition/subtraction, M - multiplication, E - exponent. Syntax: ${prefix}customquestion (options)`,
	permissions: 'gamma',
	commandFunction: function (Bot, room, time, by, args, client) {
		if (!args[0]) return Bot.say(room, unxa);
		let opts = args.join(' ').toLowerCase().replace(/[^0-9aem,-]/g, '').split(',');
		if (!opts[0]) return Bot.say(room, unxa);
		let options = [];
		let opt = opts.random();
		if (/^[ame][0-9]-[0-9]$/.test(opt)) {
			let nums = opt.substr(1).split('-').map(num => parseInt(num));
			let ques = '';
			switch (opt[0]) {
				case 'a': {
					ques = Math.floor(Math.random() * (10 ** nums[0])) + [' + ', ' - '][Math.floor(Math.random() * 2)] + Math.floor(Math.random() * (10 ** nums[1]));
					break;
				}
				case 'm': {
					ques = Math.floor(Math.random() * (10 ** nums[0])) + ' * ' + Math.floor(Math.random() * (10 ** nums[1]));
					break;
				}
				case 'e': {
					ques = Math.floor(Math.random() * (10 ** nums[0])) + ' ** ' + Math.floor(Math.random() * (10 ** nums[1]));
					break;
				}
			}
			Bot.rooms[room].ques = ques;
			Bot.rooms[room].diff = 0;
			Bot.rooms[room].ans = eval(ques);
			Bot.say(room, '**Question: ' + ques.replace('**', '^') + ' = ?**');
			Bot.rooms[room].gameActive = true;
			Bot.rooms[room].custom = opts;
		}
		else return Bot.pm(by, "AAAAA");
	}
}