module.exports = {
    cooldown: 50000,
    help: `Displays the record of Tours created.`,
    permissions: 'alpha',
    commandFunction: function (Bot, room, time, by, args, client) {
        Bot.say(room, `/addhtmlbox <DETAILS><SUMMARY>Tour Records</SUMMARY>${JSON.parse(fs.readFileSync('./data/DATA/tourrecords.json')).map(t=>tools.colourize(tools.toName(t.starter))+' > '+tools.colourize(tools.toName(t.type))).join('<BR>')}</DETAILS>`);
    }
}