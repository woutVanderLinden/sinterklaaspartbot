module.exports = {
    cooldown: 1000,
    help: `Pats a user.`,
    permissions: 'gamma',
    commandFunction: function (Bot, room, time, by, args, client) {
        Bot.say(room, `/me pats ${args.length?args.join(' '):by.substr(1)}`);
    }
}