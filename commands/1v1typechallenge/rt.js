module.exports = {
    cooldown: 1000,
    help: `Displays a random type.`,
    permissions: 'none',
    commandFunction: function (Bot, room, time, by, args, client) {
    	  let rtype = typelist[Math.floor(18*Math.random())];
        if (tools.hasPermission(by, 'gamma')) Bot.say(room, `/adduhtml TYPE,Random Type: ${tools.colourize(tools.toName(rtype))}`);
        else Bot.say(room, '/pminfobox ' + by + ', ' + `Random Type: ${tools.colourize(tools.toName(rtype))}`);
    }
}