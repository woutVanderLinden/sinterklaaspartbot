module.exports = {
    cooldown: 1000,
    help: `Submits a Type + Colour combination for the colourization of type-related stuff. Syntax: ${prefix}submitcolour (colour [hex code]), (type)`,
    permissions: 'none',
    commandFunction: function (Bot, room, time, by, args, client) {
        let cargs = args.join('').split(',');
        if (!cargs[1]) return Bot.say(room, unxa);
        let colour = cargs[0].toUpperCase().replace(/[^0-9A-F]/g, '');
        if (!colour.length == 6) return Bot.say(room, 'Invalid colour hex.');
        colour = '#' + colour;
        let type = toId(cargs[1]);
        if (!typelist.includes(type)) return Bot.say(room, 'Invalid type.');
        fs.appendFileSync('./data/DATA/typecoloursubs.txt', '\n' + colour + ' : ' + type);
        return Bot.say(room, 'Your submission has been logged. (' + colour + ' for ' + tools.toName(type) + ')');
    }
}