module.exports = {
    cooldown: 10000,
    help: `No, you.`,
    permissions: 'none',
    commandFunction: function (Bot, room, time, by, args, client) {
        Bot.say(room, `\\(o_o)/`);
    }
}