module.exports = {
  cooldown: 10,
  help: `Used to hit in Blackjack. Syntax: ${prefix}hit`,
  permissions: 'none',
  commandFunction: function (Bot, room, time, by, args, client) {
    if (!Bot.rooms[room].blackjack) return Bot.pm(by, 'No game of Blackjack is currently active...');
    if (!(Bot.rooms[room].blackjack.turn == toId(by))) return Bot.pm(by, `It's not your turn.`);
    let bj = Bot.rooms[room].blackjack, user = toId(by);
    bj.players[user].cards.push(bj.deck.pop());
    let sum = tools.sumBJ(bj.players[user].cards);
    if (sum > 21) {
      Bot.say(room, `${bj.players[user].name} has busted with ${sum}!`);
      bj.players[user].busted = true;
      return bj.nextTurn(room);
    }
    return Bot.pm(by, `Your cards: ${bj.players[user].cards.map(card => tools.cardFrom(card).join('')).join(', ')}. Your current sum: ${sum}`);
  }
}