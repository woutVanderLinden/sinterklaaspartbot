module.exports = {
    cooldown: 10000,
    help: `Links the GitHub for PartBot's code repository.`,
    permissions: 'none',
    commandFunction: function (Bot, room, time, by, args, client) {
        Bot.say(room, `/w ${by}, https://github.com/PartMan7/PartBot`);
    }
}