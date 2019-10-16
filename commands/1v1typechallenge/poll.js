module.exports = {
    cooldown: 1000,
    help: `Creates a Tournament Poll with the given options. Syntax: ${prefix}poll (time (in minutes)) (autostart / official (optional))`,
    permissions: 'beta',
    commandFunction: function (Bot, room, time, by, args, client) {
        if (!args[0]) return Bot.say(room, unxa);
        let pollRoom = room;
        if (args[0].toLowerCase() === 'status' || args[0].toLowerCase() === 'show' || args[0].toLowerCase() === 'view' || args[0].toLowerCase() === 'display') {
            if (!pollObject[pollRoom].active) return Bot.say(room, 'No polls are currently active.');
            let outArr = Object.keys(pollObject[pollRoom].votes).filter(name => name.toLowerCase() === name).map(name => pollObject[pollRoom].votes[name]).map(name => name.charAt(0) + name.substr(1)).sort();
            let curWin = tools.modeArray(outArr).map(type => type.charAt(0).toUpperCase() + type.substr(1)).sort();
            if (!curWin[0]) curWin = false;
            let timeRem = pollObject[pollRoom].endTime - Date.now();
            return Bot.say(room, 'The poll will end in ' + tools.humanTime(timeRem) + '. Currently, ' + ((curWin)?(tools.listify(curWin) + ' ' + (curWin.length ==1 ? 'is' : 'are') + ' in the lead.'):('no votes have been cast.')));
        }
        if (args[0].toLowerCase() === 'cancel') {
            if (!pollObject[pollRoom].active) return Bot.say(room, "No polls are currently active.");
            clearTimeout(pollSetTimer);
            pollObject[pollRoom].active = false;
            pollObject[pollRoom].votes = {};
            pollObject[pollRoom].autostart = false;
            pollObject[pollRoom].endTime = 0;
            return Bot.say(room, 'The poll has been cancelled.');
        }
        if (args[0].toLowerCase() === 'end') {
            if (!pollObject[pollRoom].active) return Bot.say(room, "No polls are currently active.");
            clearTimeout(pollSetTimer);
            return startPoll(pollRoom);
        }
        if (pollObject[pollRoom].active) return Bot.say(room, 'A poll is already active.');
        if (pollObject[pollRoom]) {
            pollObject[pollRoom] = {
                votes: {},
                active: true,
                autostart: false,
                official: false,
                endTime: 0
            }
        }
        let ttime = parseFloat(args[0].replace(/[^0-9]/g, ''));
        if (args[1] && ['as', 'autostart'].includes(toId(args[1]))) pollObject[pollRoom].autostart = true;
        if (isNaN(ttime)) return Bot.say(room, 'Invalid time.');
        if (ttime > 20 || ttime < 0.5) return Bot.say(room, 'Given time does not fall in a valid range.');
        ttime *= 60000;
        typelist.forEach(type => {pollObject[pollRoom].votes[type.toUpperCase()] = type});
        function startPoll(pollRoom) {
            if (!pollObject[pollRoom]) return Bot.say(room, 'Something went wrong.');
            let finalType = tools.modeArray(Object.values(pollObject[pollRoom].votes))[Math.floor(Math.random()*tools.modeArray(Object.values(pollObject[pollRoom].votes)).length)];
            if (!typelist.includes(finalType)) return Bot.say(room, 'Error: Type not found.');
            Bot.say(room, 'The poll has ended!');
            if (!pollObject[pollRoom].autostart) {
                if (Object.keys(pollObject[pollRoom].votes).length === 18) {
                    pollObject[pollRoom].active = false;
                    pollObject[pollRoom].votes = {};
                    pollObject[pollRoom].endTime = 0;
                    return Bot.say(room, 'No votes were cast, so I chose ' + finalType.charAt(0).toUpperCase() + finalType.substr(1) + '!');
                }
                pollObject[pollRoom].active = false;
                pollObject[pollRoom].votes = {};
                pollObject[pollRoom].endTime = 0;
                return Bot.say(room, 'The voted type was ' + finalType.charAt(0).toUpperCase() + finalType.substr(1) + '!');
            }
            function staggerSay(stuff) {
                Bot.say(room, stuff);
            }
            Bot.say(room, '/tour create 1v1, rr, , 2');
            Bot.say(room, require ('../../data/TOURS/CODES/TC/' + finalType + '.js')[finalType]);
            Bot.say(room, '$settype ' + finalType);
            if (pollObject[pollRoom].official) setTimeout(staggerSay, 1000, '$official');
            pollObject[pollRoom].active = false;
            pollObject[pollRoom].votes = {};
            pollObject[pollRoom].autostart = false;
            pollObject[pollRoom].endTime = 0;
            let tourArr = JSON.parse(fs.readFileSync('./data/DATA/tourrecords.json', 'utf8'));
            tourArr.push({official: false, type: finalType, starter: toId(by), time: Date.now()});
            fs.writeFileSync('./data/DATA/tourrecords.json', JSON.stringify(tourArr));
            client.channels.get('549432010322477056').send(`Type: ${finalType.charAt(0).toUpperCase() + finalType.slice(1)} Tour started!`);
        }
        global.pollSetTimer = setTimeout(startPoll, ttime, pollRoom);
        pollObject[pollRoom].endTime = Date.now() + ttime;
        Bot.say(room, '/wall Voting for the next Tournament is now open! Use ' + prefix + 'vote (type) to vote!');
        pollSetTimer;
    }
}