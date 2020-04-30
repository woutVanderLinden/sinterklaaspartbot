module.exports = {
	cooldown: 10,
	help: `Displays your hand. Syntax: ${prefix}hand`,
	permissions: 'none',
	commandFunction: function (Bot, room, time, by, args, client) {
		if (Bot.rooms[room].blackjack) {
			if (!Bot.rooms[room].blackjack.players[toId(by)]) return Bot.pm(by, 'You\'re not in the game!');
			return Bot.pm(by, `Your hand: ${Bot.rooms[room].blackjack.players[toId(by)].cards.map(card => tools.cardFrom(card).join('')).join(', ')}`);
		}
		else if (Bot.rooms[room].ev) {
			if (!Bot.rooms[room].ev.players[toId(by)]) return Bot.pm(by, 'You\'re not in the game!');
			return Bot.sendHTML(by, tools.handHTML(Bot.rooms[room].ev.players[toId(by)].cards));
		}
		else return Bot.pm(by, 'Nope, no games found.');
	}
}