module.exports = {
    cooldown: 1000,
    help: `Filters through all Pokemon moves using RegExp. Tutorial: https://regexone.com/lesson/introduction_abcs`,
    permissions: 'none',
    commandFunction: function (Bot, by, args, client) {
        let regex = new RegExp(args.join(' ').replace(/^\s*/g, '').replace(/\s*$/g, ''), 'i');
        let out = Object.keys(data.moves).filter(m => regex.test(m));
        if (!out.length) return Bot.pm(by, 'None.');
        return Bot.sendHTML(by, '<DETAILS><SUMMARY>Results</SUMMARY>' + out.map(m => data.moves[m].name).sort().join('<BR>') + '</DETAILS>');
    }
}