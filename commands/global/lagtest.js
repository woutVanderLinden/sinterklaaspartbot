module.exports = {
    cooldown: 1,
    help: `Shows the processing lag.`,
    permissions: 'coder',
    commandFunction: function (Bot, room, time, by, args, client) {
        Bot.say(room, `${tools.humanTime(Date.now()-time)}`);
    }
}