module.exports = {
    cooldown: 1000,
    help: `Displays the experts for a given area. Syntax: ${prefix}experts (type / all)`,
    permissions: 'none',
    commandFunction: function (Bot, room, time, by, args, client) {
        if (!args[0] || args[2]) return Bot.say(room, unxa);
        if (!typelist.includes(args[0].toLowerCase()) && !args[0].toLowerCase() === 'all') return Bot.say(room, 'That type doesn\'t seem to exist.');
        if (args[0].toLowerCase() === 'all') {
            let outarr = [];
            typelist.forEach(function(type) {
                let edoc = require('../../data/EXPERTS/tc.js')[type];
                if (edoc == undefined) return Bot.say(room, 'Something went wrong. Blame PartMan.');
                let outputv = '';
                if (edoc.length === 0) outputv = `There are no TC ${tools.toName(type)} Experts.`;
                else {
                    let temparr = edoc.sort().map(exps => tools.colourize(tools.toName(exps)));
                    outputv = `The TC ${tools.toName(type)} Expert${(edoc.length===1)?' is':'s are'} ${tools.listify(temparr)}.`;
                }
                outarr.push(outputv);
            });
            if (tools.hasPermission(by, 'gamma')) return Bot.say(room, '/adduhtml EXPERTS, <HR>' + outarr.join('<BR>') + '<HR>');
            else return Bot.say(room, '/pminfobox ' + by + ', ' + outarr.join('<BR>'));
        }
        if (!typelist.includes(args[0].toLowerCase())) return Bot.say(room, 'It doesn\'t look like that type exists.');
        let edoc = require('../../data/EXPERTS/tc.js')[args[0].toLowerCase()];
        if (edoc == undefined) return Bot.say(room, 'Something went wrong. Blame PartMan.');
        let temparr = [];
        let outputv = '';
        if (edoc.length === 0) outputv = `There are no TC ${tools.toName(args[0].toLowerCase())} Experts.`;
        else if (edoc.length === 1) outputv = `The TC ${tools.toName(args[0].toLowerCase())} Expert is ${tools.colourize(tools.toName(edoc[0]), edoc[0])}.`;
        else {
        	temparr = edoc.sort().map(exps => tools.colourize(tools.toName(exps)));
        	outputv = `The TC ${tools.toName(args[0].toLowerCase())} Experts ${(temparr[1])?'are':'is'} ${tools.listify(temparr)}.`;
        }
        if (tools.hasPermission(by, 'gamma')) return Bot.say(room, '/adduhtml EXPERTS, <HR>' + outputv + '<HR>');
        else return Bot.say(room, '/pminfobox ' + by + ', ' + outputv);
    }
}