module.exports = {
    cooldown: 1,
    help: `Hotpatches stuff.`,
    permissions: 'coder',
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
            case 'customcolours': case 'cc': case 'customcolors': {
                require('request')('http://play.pokemonshowdown.com/config/config.js', (error, response, body) => { 
                    fs.writeFileSync('./data/DATA/customcolors.json', JSON.stringify(eval(body),null,2));
                    Bot.say(room, 'Custom colours have been hotpatched.');
                    Bot.log(by.substr(1) + " hotpatched custom colours.");
                });
                break;
            }
            case 'chat': {
            	delete require.cache[require.resolve('../../hydrocity.js')];
            	Bot.say(room, 'Chat has been hotpatched.');
            	return Bot.log(by.substr(1) + ' hotpatched chat.');
            	break;
            }
            case 'board': case 'boards': {
            	delete require.cache[require.resolve('../../data/boards.js')];
            	delete require.cache[require.resolve('../../data/board.js')];
            	delete require.cache[require.resolve('../../data/templates.js')];
            	tools.board = require('../../data/boards.js').render;
            	Bot.say(room, 'Boards have been hotpatched.');
            	return Bot.log(by.substr(1) + " hotpatched boards.");
            	break;
            }
            default: {
                Bot.say(room, 'Invalid hotpatch.');
                break;
            }
        }
    }
}