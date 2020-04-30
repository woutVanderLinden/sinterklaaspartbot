module.exports = {
    cooldown: 1000,
    help: `Displays your permissions level. Order: Admin > Coder > Alpha > Beta > Gamma > Pleb > Locked.`,
    permissions: 'locked',
    commandFunction: function (Bot, room, time, by, args, client) {
        if (args[0]) return Bot.say(room, unxa);
        let rank = tools.rankLevel(by, room);
        let role;
        switch (rank) {
        	case 1:
        		role = 'Locked.';
        		break;
        	case 2:
        		role = 'a pleb.';
        		break;
        	case 3:
        		role = 'a Gamma.';
        		break;
        	case 4:
        		role = 'a Beta.';
        		break;
        	case 5:
        		role = 'an Alpha.';
        		break;
        	case 9:
        		role = 'a Coder.';
        		break;
        	case 10:
        		role = 'a Bot Administrator.'
        		break;
        	default:
        		role = 'somehow screwing up the Bot code. Definitely not PartMan\'s fault.';
        		break;
        }
        Bot.say(room, 'You are ' + role);
    }
}