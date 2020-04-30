module.exports = {
  cooldown: 1,
  help: `The Blackjack module. Syntax: ${prefix}blackjack (new | start | join | help | end)`,
  permissions: 'none',
  commandFunction: function (Bot, room, time, by, args, client) {
    if (!args.length) args.push('help');
    switch (args.shift().toLowerCase()) {
      case 'help': case 'h': {
        let help  = `The aim of the game is to get more than the dealer and win. However, if your score exceeds 21, you 'bust' and lose. Cards 2-10 have their face values; J, Q, and K are 10 apiece, and A can be 1 or 11. Use \`\`${prefix}hit\`\` to draw another card, \`\`${prefix}stay\`\` to end, or \`\`${prefix}hand\`\` to see your cards.`;
        if (tools.hasPermission(by, 'gamma', room)) return Bot.say(room, help);
        else return Bot.pm(by, '!code ' + help);
        break;
      }
      case 'new': case 'n': case 'create': case 'c': {
        if (!tools.hasPermission(by, 'beta', room)) return Bot.pm(by, 'Access denied.');
        if (Bot.rooms[room].blackjack) return Bot.say(room, `A game of Blackjack is in signups! Use \`\`${prefix}blackjack join\`\` to join!`);
        Bot.rooms[room].blackjack = {
          players: {},
          started: false,
          dealer: [],
          turn: null,
          start: (room) => {
            if (!Bot.rooms[room].blackjack) return;
            if (!Object.keys(Bot.rooms[room].blackjack.players).length) {
              Bot.say(room, 'Not enough players. :(');
              return delete Bot.rooms[room].blackjack;
            }
            Bot.rooms[room].blackjack.started = true;
            Bot.rooms[room].blackjack.deck = tools.newDeck(null, 2).shuffle();
            Bot.rooms[room].blackjack.dealer.push(Bot.rooms[room].blackjack.deck.pop());
            Bot.rooms[room].blackjack.dealer.push(Bot.rooms[room].blackjack.deck.pop());
            Object.keys(Bot.rooms[room].blackjack.players).forEach(player => {
              Bot.rooms[room].blackjack.players[player].cards.push(Bot.rooms[room].blackjack.deck.pop());
              Bot.rooms[room].blackjack.players[player].cards.push(Bot.rooms[room].blackjack.deck.pop());
              Bot.say(room, ` ${Bot.rooms[room].blackjack.players[player].name}'${player.endsWith('s') ? '' : 's'} top card: ${tools.cardFrom(Bot.rooms[room].blackjack.players[player].cards[0]).join('')}`);
            });
            Bot.say(room, `The Dealer's top card: ${tools.cardFrom(Bot.rooms[room].blackjack.dealer[0]).join('')}`);
            return Bot.rooms[room].blackjack.nextTurn(room);
          },
          nextTurn (room) {
            let players = Object.keys(Bot.rooms[room].blackjack.players);
            if (!Bot.rooms[room].blackjack.turn) Bot.rooms[room].blackjack.turn = players[0];
            else if (Bot.rooms[room].blackjack.turn !== players[players.length - 1]) Bot.rooms[room].blackjack.turn = players[players.indexOf(Bot.rooms[room].blackjack.turn) + 1];
            else {
              while (tools.sumBJ(Bot.rooms[room].blackjack.dealer) < 17) Bot.rooms[room].blackjack.dealer.push(Bot.rooms[room].blackjack.deck.pop());
              let score = tools.sumBJ(Bot.rooms[room].blackjack.dealer);
              if (tools.sumBJ(Bot.rooms[room].blackjack.dealer) > 21) {
                Bot.say(room, `The dealer has busted with ${score}! (${Bot.rooms[room].blackjack.dealer.map(card => tools.cardFrom(card).join('')).join(', ')})`);
                score = 0;
              }
              else Bot.say(room, `The dealer has ${score}! (${Bot.rooms[room].blackjack.dealer.map(card => tools.cardFrom(card).join('')).join(', ')})`);
              let winners = Object.keys(Bot.rooms[room].blackjack.players).filter(player => tools.sumBJ(Bot.rooms[room].blackjack.players[player].cards) > score && !Bot.rooms[room].blackjack.players[player].busted).map(player => Bot.rooms[room].blackjack.players[player].name);
              Bot.say(room, `Winners: ${winners.length ? tools.listify(winners) : 'None'}!`);
              let nbj = winners.filter(player => Bot.rooms[room].blackjack.players[toId(player)].nbj);
              if (nbj.length) Bot.say(room, `${tools.listify(nbj)} ha${nbj.length == 1 ? 'has' : 'have'} a natural Blackjack!`);
              nbj.forEach(player => tools.addPoints(player, 5, room));
              winners.forEach(player => tools.addPoints(player, 5, room));
              return delete Bot.rooms[room].blackjack;
            }
            if (Bot.rooms[room].blackjack.timer) clearInterval(Bot.rooms[room].blackjack.timer);
            /*Bot.rooms[room].blackjack.timer = setTimeout(room => {
              if (!room) return;
              if (!Bot.rooms[room].blackjack) return;
              Bot.say(room, `${Bot.rooms[room].blackjack.players[Bot.rooms[room].blackjack.turn].name} was disqualified.`);
              delete Bot.rooms[room].blackjack.players[Bot.rooms[room].blackjack.turn];
              Bot.rooms[room].blackjack.nextTurn(room);
            }, 60000, room);*/
            Bot.say(room, ` ${Bot.rooms[room].blackjack.players[Bot.rooms[room].blackjack.turn].name}'${Bot.rooms[room].blackjack.turn.endsWith('s') ? '' : 's'} turn! Use \`\`${prefix}hit\`\` or \`\`${prefix}stay\`\`!`);
            return Bot.pm(Bot.rooms[room].blackjack.turn, `Your cards: ${Bot.rooms[room].blackjack.players[Bot.rooms[room].blackjack.turn].cards.map(card => tools.cardFrom(card).join('')).join(', ')}. Your current sum: ${tools.sumBJ(Bot.rooms[room].blackjack.players[Bot.rooms[room].blackjack.turn].cards)}`);
          }
        }
        if (args.length) {
          let time = parseInt(args.join('').replace(/[^0-9]/g, ''));
          if (!isNaN(time) && time >= 20 && time <= 120) {
            setTimeout(Bot.rooms[room].blackjack.start, time * 1000, room);
            return Bot.say(room, `A game of Blackjack has been created! Use \`\`${prefix}blackjack join\`\` to join in the next ${time} seconds!`);
          }
        }
        return Bot.say(room, `A game of Blackjack has been created! Use \`\`${prefix}blackjack join\`\` to join!`);
        break;
      }
      case 'join': case 'j': {
        if (!Bot.rooms[room].blackjack) return Bot.say(room, `There isn't a game of Blackjack active...`);
        if (Bot.rooms[room].blackjack[toId(by)]) return Bot.pm(by, `You've already joined!`);
        if (Bot.rooms[room].blackjack.started) return Bot.pm(by, 'It already started, F.');
        Bot.rooms[room].blackjack.players[toId(by)] = {
          name: by.substr(1),
          cards: []
        }
        return Bot.pm(by, `You have joined the game of Blackjack in ${Bot.rooms[room].title}.`);
        break;
      }
      case 'start': case 's': {
        if (!tools.hasPermission(by, 'beta', room)) return Bot.pm(by, 'Access denied.');
        if (!Bot.rooms[room].blackjack) return Bot.say(room, `There isn't a game of Blackjack active...`);
        Bot.rooms[room].blackjack.start(room);
        return;
        break;
      }
      case 'end': case 'e': {
        if (!tools.hasPermission(by, 'beta', room)) return Bot.pm(by, 'Access denied.');
        if (!Bot.rooms[room].blackjack) return Bot.say(room, 'Blackjack wasn\'t even ongoing, :eyes:.');
        delete Bot.rooms[room].blackjack;
        return Bot.say(room, 'The game of Blackjack has ended! No points will be awarded.');
        break;
      }
      default: {
        return Bot.say(room, `That isn't an option...`);
        break;
      }
    }
  }
}