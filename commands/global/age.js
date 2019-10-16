module.exports = {
    cooldown: 10000,
    help: `Displays the age of a user.`,
    permissions: 'none',
    commandFunction: function (Bot, room, time, by, args, client) {
        if (!args[0]) return Bot.say(room, unxa);
        require('request')('http://pokemonshowdown.com/users/' + toId(args.join(' ')) + '.json', (err, response, body) => {
            if (err) throw err;
            let userObj = JSON.parse(body);
            if (!userObj.registertime) return Bot.say(room, toId(args.join(' ')) + ' is not registered.');
            let dtime = Date.now() - 1000*userObj.registertime;
            if (tools.hasPermission(by, 'gamma')) Bot.say(room, userObj.username + ' is ' + tools.humanTime(dtime) + ' old.');
            else Bot.pm(by, userObj.username + ' is ' + tools.humanTime(dtime) + ' old.');
        });
    }
}