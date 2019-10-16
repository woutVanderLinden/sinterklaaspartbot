module.exports = {
    cooldown: 10000,
    help: `Displays the uptime of the Bot.`,
    permissions: 'none',
    commandFunction: function (Bot, room, time, by, args, client) {
        Bot.say(room, `The Bot has been running for ${tools.humanTime(process.uptime() * 1000)}.`);
    }
}