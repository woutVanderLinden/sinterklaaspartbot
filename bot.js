'use strict';
let http = require('http'), SDClient = require('./client.js'), Discord = require('discord.js'), globaljs = require('./global.js'), client = new Discord.Client(), options = {serverid: config.serverid, loginServer: 'https://play.pokemonshowdown.com/~~' + config.serverid +'/action.php', nickName: config.nickName, pass: config.pass, avatar: (config.avatar)?config.avatar:null, status: (config.status)?config.status:null, autoJoin: config.autoJoin};
global.Bot = new SDClient(config.server, config.port, options);
Bot.connect();
client.login(config.token);
client.on("ready", () => {console.log(`Connected to Discord.`); client.user.setActivity("Type Challenge: Ghost!");});
let standard_input = process.stdin; standard_input.setEncoding('utf-8'); standard_input.on('data', function(data) { try {console.log(eval(data));} catch(e) {console.log(e);}});
client.on('message', async message => {
  if (/official.*role.*giv|giv.*official.*role/.test(toId(message.content)) && !/ask/.test(toId(message.content))) {
    if (!message.member.roles.has('616345204533755920')) {
      message.member.addRole('616345204533755920').catch(console.log);
      message.channel.send('Added. ^_^');
    }
    else message.channel.send('You already have the Official role.');
  }
  else if (/official.*role.*remov|remov.*official.*role/.test(toId(message.content)) && !/ask/.test(toId(message.content))) {
    if (message.member.roles.has('616345204533755920')) {
      message.member.removeRole('616345204533755920').catch(console.log);
      message.channel.send('Removed. ^_^');
    }
    else message.channel.send('I can\'t remove the Official role if you don\'t have it...');
  }
});
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
  if (message.includes('/invite groupchat-heavystorming-teambuilding') && toId(by) == 'heavystorming') return Bot.join('groupchat-heavystorming-teambuilding');
  if (!message.startsWith(prefix)) {
    Bot.pm('PartMan', by + ': ' + message);
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
  if (commandName === 'help') return Bot.pm(by, 'I\'m a Bot by PartMan. If you have any issues regarding me, please contact them. To see my usable commands, use the ``' + prefix + 'commands`` in a chatroom.');
  tools.spliceRank(by);
});
