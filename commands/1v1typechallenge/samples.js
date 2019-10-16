module.exports = {
    cooldown: 1000,
    help: `Displays the samples for a type. Syntax: ${prefix}samples (type)`,
    permissions: 'none',
    commandFunction: function (Bot, room, time, by, args, client) {
        if (!args[0]) return Bot.say(room, unxa);
        let gtype = toId(args.join(' '));
        if (!typelist.includes(gtype)) return Bot.say(room, 'It doesn\'t look like that is a type.');
        let sampleObj = JSON.parse(fs.readFileSync('./data/SAMPLES/TC/sets.json', 'utf8'));
        if (!sampleObj[gtype]) return Bot.say(room, 'Error occurred. (Type samples not found)');
        let out = '<DETAILS><SUMMARY>' + tools.colourize(tools.toName(gtype) + ' Samples', gtype) + '</SUMMARY><HR>' + sampleObj[gtype].replace(/\r?\n/g, '<BR>') + '</DETAILS>';
        if (tools.hasPermission(by, 'gamma')) return Bot.say(room, '/adduhtml SAMPLES, ' + out);
        else return Bot.say(room, '/pminfobox ' + by + ', ' + out);
    }
}