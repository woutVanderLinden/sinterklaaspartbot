module.exports = {
    cooldown: 5000,
    help: `Displays the content of a supplied pokepast.es link.`,
    permissions: 'beta',
    commandFunction: function (Bot, room, time, by, args, client) {
      if (!args[0]) return Bot.say(room, unxa);
      link = args.join(' ');
      if (!/^https?:\/\/pokepast\.es\/[0-9a-z]+(?:\/json)?$/.test(link)) return Bot.say(room, 'Not a valid paste.');
      require('request')((link.endsWith('/json')?link:(link+'/json')),(e,r,b)=>{if(e)return Bot.log(e);Bot.say(room,'/adduhtml POKEPASTE,<DETAILS><SUMMARY>'+JSON.parse(b).title+'</SUMMARY><HR><BR>'+JSON.parse(b).paste.replace(/\n/g,'<BR>')+'</DETAILS>')});
    }
}