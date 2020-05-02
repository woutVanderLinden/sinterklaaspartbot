module.exports = {
    cooldown: 10,
    help: `Links the GitHub for PartBot's code repository.`,
    permissions: 'none',
    commandFunction: function (Bot, room, time, by, args, client) {
        if (tools.hasPermission(by, 'gamma', room)) Bot.say(room, 'https://github.com/PartMan7/PartBot');
        else Bot.pm(by, `https://github.com/PartMan7/PartBot`);
    }
}
