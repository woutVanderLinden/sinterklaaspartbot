module.exports = {
    cooldown: 1000,
    help: `Echoes stuff.`,
    permissions: 'beta',
    commandFunction: function (Bot, room, time, by, args, client) {
        Bot.say(room, `${!args[0]?'/me echoes nothing':' [[]] ' + args.join(' ')}`);
    }
}