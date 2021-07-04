module.exports = {
	cooldown: 1,
	help: ``,
	permissions: 'admin',
	commandFunction: function (Bot, room, time, by, args, client) {
		if (!args[0]) return Bot.say(room, unxa);
		let type = toID(args.join(''));
		if (!typelist.includes(type)) return Bot.say(room, 'Invalid type.');
		let a = JSON.parse(fs.readFileSync('./data/DATA/newdex.json','utf8')), b = JSON.parse(fs.readFileSync('./data/DATA/formats.json','utf8')), c = Object.keys(a).filter(m => a[m].types.includes(tools.toName(type)) && b[m].isNonstandard != 'Past' && b[m].isNonstandard != 'CAP'), d = Object.keys(a).map(m => (c.includes(m)) ? '+' + a[m].species : '-' + a[m].species).join(', ');
		fs.writeFileSync('./data/TOURS/CODES/TC/' + type + '.js', `exports.${type} = "/tour name Type Challenge: ${tools.toName(type)}!\\n/tour rules ${d}\\n/wall Type Challenge: ${tools.toName(type)}!";`);
		return Bot.say(room, 'UwU');
	}
}