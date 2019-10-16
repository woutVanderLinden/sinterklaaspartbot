module.exports = {
    cooldown: 10000,
    help: `UwUs.`,
    permissions: 'gamma',
    commandFunction: function (Bot, room, time, by, args, client) {
        Bot.say(room, `UwU`);
    }
}