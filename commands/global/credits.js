module.exports = {
    cooldown: 100000,
    help: `Displays the credits.`,
    permissions: 'none',
    commandFunction: function (Bot, room, time, by, args, client) {
        let credStr = tools.colourize('Ecuacion') + ' for the base of client.js.<BR>' + tools.colourize('cycro') + ' for their help in the initial phase of development of the Bot.<BR>' + tools.colourize('PartMan') + ' for doing pretty much everything else.<BR>' + tools.colourize('Morfent') + ', ' + tools.colourize('JumboWhales') + ', ' + tools.colourize('JetOU') + ', and ' + tools.colourize('XpRienzo') + ' for helping fix things that PartMan completely screwed up.<BR>And ' + tools.colourize('Zarel') + ' and the other contributers of Pokémon Showdown, for, you know, making PS?';
        if (tools.hasPermission(by, 'gamma', room)) return Bot.say(room, '/adduhtml CREDITS,' + credStr);
        else Bot.say(room, '/pminfobox ' + by + ', ' + credStr);
    }
}