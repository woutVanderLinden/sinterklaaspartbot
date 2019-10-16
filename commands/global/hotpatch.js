module.exports = {
    cooldown: 0,
    help: `Hotpatches stuff.`,
    permissions: 'admin',
    commandFunction: function (Bot, room, time, by, args, client) {
        if (!args[0]) return Bot.say(room, unxa);
        switch(args[0].toLowerCase()) {
        	case 'global': {
        		delete require.cache[require.resolve('../../global.js')];
        		globaljs = require('../../global.js');
        		Bot.say(room, 'Global has been hotpatched.');
        		Bot.log(by.substr(1) + ' hotpatched global.');
                break;
        	}
        	case 'tools': {
        		delete require.cache[require.resolve('../../data/tools.js')];
        		global.tools = require('../../data/tools.js');
        		Bot.say(room, 'Tools have been hotpatched.');
        		Bot.log(by.substr(1) + ' hotpatched tools.');
                break;
        	}
            case 'matrix': {
                delete require.cache[require.resolve('../../data/matrix.js')];
                tools.matrix = require('../../data/matrix.js');
                Bot.say(room, 'Matrix has been hotpatched.');
                Bot.log(by.substr(1) + ' hotpatched matrix.');
                break;
            }
            default: {
                Bot.say(room, 'Invalid hotpatch.');
                break;
            }
        }
    }
}