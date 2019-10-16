module.exports = {
    cooldown: 1000,
    help: `Creates a Blitz with the given options. Syntax: ${prefix}blitz (autostart / official (optional))`,
    permissions: 'beta',
    commandFunction: function (Bot, room, time, by, args, client) {
        return Bot.say(room, 'In progress.');
    }
}