module.exports = {
    cooldown: 100,
    help: `Invites people to a groupchat.`,
    permissions: 'none',
    commandFunction: function (Bot, room, time, by, args, client) {
        if (!args.length) return Bot.say(room, 'No name detected.');
        if (!room.startsWith('groupchat-')) return Bot.say(room, 'Not a groupchat.');
        args.join(' ').split(',').forEach(user => Bot.say(room, `/invite ${user}`));
    }
}