module.exports = {
    cooldown: 1000,
    help: `Displays the age of a user.`,
    permissions: 'none',
    commandFunction: function (Bot, by, args, client) {
        if (!args[0]) args.push(by);
        require('request')('http://pokemonshowdown.com/users/' + toId(args.join(' ')) + '.json', (err, response, body) => {
            if (err) throw err;
            let userObj = JSON.parse(body);
            if (!userObj.registertime) return Bot.pm(by, toId(args.join(' ')) + ' is not registered.');
            let dtime = Date.now() - 1000 * userObj.registertime;
            Bot.pm(by, userObj.username + ' is ' + tools.humanTime(dtime) + ' old.');
        });
    }
}