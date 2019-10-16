module.exports = {
    cooldown: 0,
    help: `Testing stuff.`,
    permissions: 'admin',
    commandFunction: function (Bot, room, time, by, args, client) {
        Bot.say(room, `Testing.`);
    }
}