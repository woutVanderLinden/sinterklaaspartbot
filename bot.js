'use strict';
let http = require('http'), SDClient = require('./client.js'), Discord = require('discord.js'), globaljs = require('./global.js'), options = {serverid: config.serverid, loginServer: 'https://play.pokemonshowdown.com/~~' + config.serverid +'/action.php', nickName: config.nickName, pass: config.pass, avatar: (config.avatar)?config.avatar:null, status: (config.status)?config.status:null, autoJoin: config.autoJoin};
if (!config.prefix) return console.log('Missing configuration - prefix.'); //remove this line if you don't want a prefix
if (!config.owner) return console.log('Missing configuration - owner.');
if (!admin) return console.log('Missing administrator - update global.js /ranks/');
global.Bot = new SDClient(config.server, config.port, options);
Bot.connect();
if (config.token) {
  let client = new Discord.client();
  client.login(config.token);
  client.on("ready", () => {console.log(`Connected to Discord.`); if (config.discordStatus) client.user.setActivity(config.discordStatus)});
}
else {
  let client = null;
}
let standard_input = process.stdin; standard_input.setEncoding('utf-8'); standard_input.on('data', function(data) { try {console.log(eval(data));} catch(e) {console.log(e);}});
if (config.token) {
  client.on('message', async message => {});
}
Bot.on('chat', function (room, time, by, message) {
  if (message === Bot.status.nickName + '?') return Bot.pm(by, `Hi, I'm ${Bot.status.nickName}! I'm a Bot. My prefix is \`\`${prefix}\`\`. For more information, use \`\`${prefix}help\`\`.`);
  if (!message.startsWith(prefix)) return;
  if (ignoreRooms.includes(room)) return;
  if (message === ',eval 1') return Bot.say(room, '1');
  let args = message.substr(prefix.length).split(' ');
  let commandName = tools.commandAlias(args.shift().toLowerCase());
  tools.grantPseudo(by);
  if (['eval','output'].includes(commandName)) {
    if (!tools.hasPermission(toId(by), 'admin')) return Bot.say(room, 'Access denied.');
    try {
      let outp = eval(args.join(' '));
      switch (typeof outp) {
        case 'object':
          outp = JSON.stringify(outp);
          break;
        case 'function':
          outp = outp.toString();
          break;
      }
      if (commandName === 'eval' || (!String(outp).split('\n')[1] && String(outp.length > 300))) Bot.say(room, outp);
      else Bot.say(room, '!code ' + outp)
    }
    catch (e) {
      console.log(e);
      Bot.say(room, e.message);
    }
    return;
  }
  fs.readdir('./commands/global', (e, files) => {
    if (e) return console.log(e);
    if (!files.includes(commandName + '.js')) {
      fs.readdir('./commands', (err, rfiles) => {
        if (err) return console.log(err);
        if (rfiles.includes(room)) {
          fs.readdir('./commands/' + room, (error, roomfiles) => {
            if (!roomfiles.includes(commandName + '.js')) return Bot.say(room, 'It doesn\'t look like that command exists.');
            let commandRequire = require('./commands/' + room + '/' + commandName + '.js');
            if (!tools.hasPermission(toId(by), commandRequire.permissions)) {
              tools.spliceRank(by);
              return Bot.say(room, 'Access denied.');
            }
            try {
              if (cooldownObject[room] && cooldownObject[room][commandName]) return Bot.pm(by, 'Cooling down.');
              commandRequire.commandFunction(Bot, room, time, by, args, client);
              tools.setCooldown(commandName, room, commandRequire);
              tools.spliceRank(by);
              return;
            }
            catch (e) {
              if (e) console.log(e);
            }
          });
        }
      });
      return;
    }
    else {
      let commandRequire = require('./commands/global/' + commandName + '.js');
      if (!tools.hasPermission(toId(by), commandRequire.permissions)) {
        tools.spliceRank(by);
        return Bot.say(room, 'Access denied.');
      }
      try {
        if (cooldownObject[room] && cooldownObject[room][commandName]) return Bot.pm(by, 'Cooling down.');
        commandRequire.commandFunction(Bot, room, time, by, args, client);
        tools.setCooldown(commandName, room, commandRequire);
        tools.spliceRank(by);
        return;
      }
      catch (e) {
        if (e) console.log(e);
      }
    }
  });
});
Bot.on('chaterror', (room, message, isIntro) => {if (!isIntro) console.log('ERROR: ' + room + '> ' + message);});
Bot.on('popup', (message) => {console.log('POPUP: ' + message);});
Bot.on('querydetails', (message) => {Bot.say(queryRoom, message);});
Bot.on('chatsuccess', (room, time, by, message) => Bot.rooms[room].rank = by.charAt(0));
Bot.on('pm', (by, message) => {
  if (!message.startsWith(prefix)) {
    Bot.pm(config.owner, by + ': ' + message);
    return Bot.pm(by, `Hi, I'm ${Bot.status.nickName}! I'm a Bot. My prefix is \`\`${prefix}\`\`.`);
  }
  let args = message.substr(prefix.length).split(' ');
  let commandName = tools.commandAlias(args.shift().toLowerCase());
  tools.grantPseudo(by);
  if (commandName === 'eval') {
    if (!tools.hasPermission(toId(by), 'admin')) return Bot.pm(by, 'Access denied.');
    try {
      let outp = eval(args.join(' '));
      switch (typeof outp) {
        case 'object':
          Bot.pm(by, JSON.stringify(outp));
          break;
        case 'function':
          Bot.pm(by, outp.toString());
          break;
        default:
          Bot.pm(by, outp);
          break;
      }
    }
    catch (e) {
      console.log(e);
      Bot.pm(by, e.message);
    }
    return;
  }
  if (commandName === 'help') return Bot.pm(by, 'I\'m a Bot by ' + config.owner + '. If you have any issues regarding me, please contact them. To see my usable commands, use the ``' + prefix + 'commands`` in a chatroom.');
  tools.spliceRank(by);
});
