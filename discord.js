exports.handler = async message => {
  let client = message.client;
  if (message.mentions && message.mentions.users && message.mentions.users.has('CLIENT_ID')) return message.channel.send(`Hi, I'm ${Bot.status.nickName}! I'm a bot by ${config.owner}. My command character is \`\`\`${prefix}\`\`\`.`);
  if (message.author.id == 'ADMIN_ID' && message.content.toLowerCase().startsWith(`${prefix}eval `)) {
    try {
      let out = eval(message.content.substr(prefix.length + 5));
      switch (typeof(out)) {
        case 'function': out = out.toString(); break;
        case 'object': out = JSON.stringify(out, null, 2); break;
        case 'undefined': return message.channel.send('undefined');
        default: break;
      }
      message.channel.send('```'+out+'```');
    } catch (e) {
      message.channel.send('```'+JSON.stringify(e)+'```');
    }
    return;
  }
  if (message.content.startsWith(prefix)) {
    let args = message.content.substr(prefix.length).split(' '), command = toId(args.shift());
    
    if (command == 'timer') {
      if (!client.timers) client.timers = {};
      if (!args.length) return message.channel.send(unxa);
      let msg = toId(args.join(''));
      let min = msg.match(/\d+(?:m(?:in(?:utes?)?)?)/), sec = msg.match(/\d+(?:s(?:ec(?:onds?)?)?)/), ttime = 0;
      if (!min && !sec) return Bot.pm(by, 'Could not detect a valid time.');
      if (min) ttime += (parseInt(min[0]) * 60 * 1000);
      if (sec) ttime += (parseInt(sec[0]) * 1000);
      clearInterval(client.timers[message.author.id]);
      client.timers[message.author.id] = setTimeout(message => message.reply('time\'s up!'), ttime, message);
      return message.channel.send(`A timer has been set for ${tools.humanTime(ttime)}.`);
      client.timers[message.author.id]
    }
     if(command == "ping") {
      
      message.reply('Pong!');
        
    }
    if(command == "avatar") {
      message.reply(message.author.displayAvatarURL());
      
    }
  }
}
