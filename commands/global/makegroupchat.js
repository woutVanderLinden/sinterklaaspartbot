module.exports = {
    cooldown: 1000,
    help: `Creates a groupchat.`,
    permissions: 'alpha',
    commandFunction: function (Bot, room, time, by, args, client) {
        if (!args.length) return Bot.say(room, 'No name detected.');
        Bot.say(room, `/makegroupchat ${args.join(' ')}`);
      Bot.say(`groupchat-${toId(Bot.status.nickName)}-${toId(args.join(' '))}`, `/invite ${by}`);
    }
}