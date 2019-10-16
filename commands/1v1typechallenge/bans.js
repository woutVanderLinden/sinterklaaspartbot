module.exports = {
    cooldown: 1000,
    help: `Displays the bans for a type.`,
    permissions: 'none',
    commandFunction: function (Bot, room, time, by, args, client) {
        if (!args[0]) args = ['all'];
        let ftype = toId(args.join(' '));
        if (!typelist.includes(ftype) && !(ftype == 'all')) return Bot.say(room, 'Invalid type.');
        if (ftype == 'all') {
        	let out = '';
        	typelist.forEach(type => {
        		out += 'TC ' + tools.colourize(tools.toName(type)) + ' Banlist: ';
        		let bans = require('../../data/VR/TC/' + type + '.js')[type].bans;
        		if (bans.length) out += bans.join(', ');
        		else out += 'None';
        		out += '<BR>';
        	});
        	if (tools.hasPermission(by, 'gamma')) return Bot.say(room, '/adduhtml BANS, ' + out);
        	else return Bot.say(room, '/pminfobox ' + by + ', ' + out);
        }
        let bans = require('../../data/VR/TC/' + ftype + '.js')[ftype].bans;
        return Bot.say(room, 'TC ' + tools.toName(ftype) + ' Banlist: ' + ((bans.length) ? bans.join(', ') : 'None'));
    }
}