module.exports = {
    cooldown: 1000,
    help: `Warms up a command.`,
    permissions: 'alpha',
    commandFunction: function (Bot, room, time, by, args, client) {
        Bot.say(room, `In progress.`);
    }
}