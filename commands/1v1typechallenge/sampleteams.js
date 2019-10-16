module.exports = {
    cooldown: 1000,
    help: `Displays the Sample Teams for a given type. Syntax: ${prefix}sampleteams (type)`,
    permissions: 'none',
    commandFunction: function (Bot, room, time, by, args, client) {
        if (!args[0]) return Bot.say(room, unxa);
        let gtype = toId(args.join(' '));
        if (!typelist.includes(gtype)) return Bot.say(room, 'It doesn\'t look like that is a type.');
        let sampleObj = JSON.parse(fs.readFileSync('./data/SAMPLES/TC/teams.json', 'utf8'));
        if (!sampleObj[gtype]) return Bot.say(room, 'Error occurred. (Type samples not found)');
        let out = '<DETAILS><SUMMARY>' + tools.colourize(tools.toName(gtype) + ' Sample Teams', gtype) + '</SUMMARY><HR>' + Object.keys(sampleObj[gtype]).map(team => '<DETAILS><SUMMARY><B>' + team + '</B></SUMMARY><HR>' + sampleObj[gtype][team].replace(/\r?\n/g, '<BR>').replace(/(?:<BR>\s*){7,}/g, '<BR>') + '</DETAILS>').join('<HR>') + '<HR></DETAILS>';
        if (tools.hasPermission(by, 'gamma')) return Bot.say(room, '/adduhtml SAMPLETEAMS, ' + out);
        else return Bot.say(room, '/pminfobox ' + by + ', ' + out);
    }
}