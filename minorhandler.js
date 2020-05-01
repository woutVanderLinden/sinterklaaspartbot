exports.handler = Bot => {
  Bot.on('chaterror', (room, message, isIntro) => {if (!isIntro) console.log('ERROR: ' + room + '> ' + message)});
  Bot.on('popup', (message) => {console.log('POPUP: ' + message);});
  Bot.on('chatsuccess', (room, time, by, message) => Bot.rooms[room].rank = by.charAt(0));
  Bot.on('tour', (room, data) => {
    if (data && data[0] == 'create') {
      if (['*', '#', '★'].includes(Bot.rooms[room].rank) && config.tourTimerRooms.includes(room)) Bot.say(room, '/tour autostart 5\n/tour autodq 2')
    }
  });
  Bot.on('join', (by, room, time) => {
    if (!Bot.jps[room] || !Bot.jps[room][by]) return;
    if (Bot.jpcool[room][by] && (Bot.jpcool[room][by][0] < 10 || time - Bot.jpcool[room][by][1] < 3600000)) return;
    Bot.say(room, Bot.jps[room][by]);
    if (!Bot.jpcool[room]) Bot.jpcool[room] = {};
    Bot.jpcool[room][by] = [0, time];
    return;
  });
  Bot.on('raw', (room, data, isIntro) => {
    if (!isIntro && /<div class="broadcast-green">Congratulations to .* for winning the game of UNO!<\/div>/.test(data)) {
      let userline = data.match(/<div class="broadcast-green">Congratulations to .* for winning the game of UNO!<\/div>/)[0], user = userline.slice(48, userline.length - 35);
      Bot.say(room, `Congratulations to ${user} for winning!`);
      tools.addPoints(user, 10, room);
    }
  });
}
