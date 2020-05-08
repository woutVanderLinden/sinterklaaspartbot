module.exports = {
  cooldown: 10,
  help: `Used to stay in Blackjack. Syntax: ${prefix}stay`,
  permissions: 'none',
  commandFunction: function (Bot, room, time, by, args, client) {
    if (!Bot.rooms[room].blackjack) return Bot.pm(by, 'No game of Blackjhack is currently active...');
    if (Bot.rooms[room].blackjack.turn !== toId(by)) return Bot.pm(by, `It's not your turn.`);
    let user = Bot.rooms[room].blackjack.players[toId(by)];
    if (tools.sumBJ(user.cards) == 21) {
      if (user.cards.length == 2) user.nbj = true;
      Bot.say(room, `${user.name} has a Blackjack!`);
    }
    return Bot.rooms[room].blackjack.nextTurn(room);
  }
}
