module.exports = {
    cooldown: 10,
    help: `The PS /tour command. Use \`\`/tour help\`\` for help.`,
    permissions: 'beta',
    commandFunction: function (Bot, room, time, by, args, client) {
        Bot.say(room, `${args.length?'/tour '+args.join(' '):'UwU'}`);
    }
}