module.exports = {
    cooldown: 0,
    help: `Exits the process.`,
    permissions: 'admin',
    commandFunction: function (Bot, room, time, by, args, client) {
        Bot.say(room, `${process.exit()}`);
    }
}