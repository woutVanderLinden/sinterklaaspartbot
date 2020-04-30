module.exports = {
    cooldown: 5000,
    help: `Pings.`,
    permissions: 'none',
    commandFunction: function (Bot, room, time, by, args, client) {
        Bot.say(room, `/w ${by}, Pong!`);
    }
}