module.exports = {
    cooldown: 1000,
    help: `Pats a user.`,
    permissions: 'gamma',
    commandFunction: function (Bot, by, args, client) {
        Bot.pm(by, `/me tests ${args.length ? args.join(' ') : by.substr(1)}`);
    }
}