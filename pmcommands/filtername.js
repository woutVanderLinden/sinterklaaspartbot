module.exports = {
    cooldown: 1000,
    help: `Filters through all Pokemon names using RegExp. Tutorial: https://regexone.com/lesson/introduction_abcs`,
    permissions: 'none',
    commandFunction: function (Bot, by, args, client) {
        let regex = new RegExp(args.join(' '), 'i');
        let out = Object.keys(data.pokedex).filter(m => data.pokedex[m].num > 0 && regex.test(m));
        if (!out.length) return Bot.pm(by, 'None.');
          return Bot.sendHTML(by, '<DETAILS><SUMMARY>Results</SUMMARY>' + out.map(m => data.pokedex[m].name).sort().join('<BR>') + '</DETAILS>');
    }
}