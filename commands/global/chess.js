module.exports = {
    cooldown: 100,
    help: `The Chess module. Use \`\`new\`\` to make a new game, \`\`join (id)\`\` to join, and \`\`play (id) (position)-(position)\`\` to play.`,
    permissions: 'none',
    commandFunction: function (Bot, room, time, by, args, client) {
        if (!args[0]) return Bot.say(room, unxa);
        switch (args[0].toLowerCase()) {
        	case 'help': {
        		return Bot.say(room, `PartBot\'s Chess module: Use ${prefix}chess play (game ID) (original position)-(final position) to play a move. Alternatively, you can click on the interactive UHTML screen.`);
        	}
        	case 'new': {
        		if (!tools.hasPermission(by, 'gamma', room)) return Bot.say(room, 'Access denied.');
        		if (Bot.rooms[room].chess) return Bot.say(room, 'A game is already active.');
        		Bot.rooms[room].chess = new tools.Chess(toId(by), room);
        		Bot.say(room, `/adduhtml CHESS, <H1>Signups have begun!</H1><BUTTON name="send" value="${prefix}chess join White">White</BUTTON><BUTTON name="send" value="${prefix}chess join Black">Black</BUTTON>`);
        		return;
        		break;
        	}
        	case 'join': {
    			if (!Bot.rooms[room].chess) return Bot.say(room, 'There isn\'t an active chess game in this room.');
        		if (!args[1]) return Bot.say(room, 'Please specify the side.');
        		let game = Bot.rooms[room].chess;
        		switch (args[1][0].toLowerCase()) {
        			case 'w': {
        				if (game.W.player) return Bot.pm(by, "Sorry, White's already taken!");
        				game.W.player = toId(by);
        				game.W.name = by.substr(1);
		        		if (!game.B.player) return Bot.say(room, `/adduhtml CHESS, <H1>Signups have begun!</H1><BUTTON name="send" value="${prefix}chess join Black">Black</BUTTON>`);
		        		else {		        			
		        			if (game.B.player === game.W.player) {
		        				game.B.player = null;
		        				game.B.name = null;
		        				return Bot.pm(by, 'Nope, not allowed to fight yourself.');
		        			}
		        			Bot.say(room, `The match between ${game.W.name} and ${game.B.name} is starting!`);
		        			game.setBoard();
		        			return Bot.say(room, `/adduhtml CHESS,${game.boardHTML(room, game.turn)}`);
		        		}
        			}
        			case 'b': {
        				if (game.B.player) return Bot.pm(by, "Sorry, Black's already taken!");
        				game.B.player = toId(by);
        				game.B.name = by.substr(1);
		        		if (!game.W.player) return Bot.say(room, `/adduhtml CHESS, <H1>Signups have begun!</H1><BUTTON name="send" value="${prefix}chess join White">White</BUTTON>`);
		        		else {
		        			if (game.B.player === game.W.player) {
		        				game.B.player = null;
		        				game.B.name = null;
		        				return Bot.pm(by, 'Nope, not allowed to fight yourself.');
		        			}
		        			Bot.say(room, `The match between ${game.W.name} and ${game.B.name} is starting!`);
		        			game.setBoard();
		        			return Bot.say(room, `/adduhtml CHESS,${game.boardHTML(room, game.turn)}`);
		        		}
        			}
        			default: return Bot.pm(by, 'Whoa, that\'s not a valid colour.')
        		}
        		break;
        	}
        	case 'play': {
    			if (!Bot.rooms[room].chess) return Bot.pm(by, 'There isn\'t an active chess game in this room.');
        		if (!args[1]) return Bot.pm(by, unxa);
        		args.shift();
        		let game = Bot.rooms[room].chess;
        		if (!(game[game.turn].player === toId(by))) return;
        		let squares = args.join('').toLowerCase().split('-');
        		game.play(game.turn, squares[0], squares[1], (run, info) => {
        			if (!run) return Bot.say(room, info);
        			if (run === 1) {
        				return Bot.say(room, `/adduhtml CHESS,${game.boardHTML(room, game.turn)}`);
        			}
        			if (run === 2) {
        				// promotion
        				return Bot.say(room, 'Yay, a promotion! Gonna add this, soon.');
        			}
                    if (run === 3) {
                        // checkmate
                        return Bot.say(room, 'Checkmate!');
                    }
                    if (run === 4) {
                        // stalemate
                        return Bot.say(room, 'Stalemate!');
                    }
        		});
                break;
        	}
        	case 'select': {
    			if (!Bot.rooms[room].chess) return Bot.pm(by, 'This room does not have any chess games.');
        		if (!args[1]) return Bot.say(room, unxa);
        		args.shift();
                let game = Bot.rooms[room].chess;
        		if (!(game[game.turn].player === toId(by))) return;
        		let square = args.join('').toLowerCase();
                let text = game.boardHTML(room, game.turn, square, game.getValidMoves(square));
                if (!text) return;
        		return Bot.say(room, `/adduhtml CHESS,${text}`);
        	}
        	case 'deselect': {
    			if (!Bot.rooms[room].chess) return Bot.pm(by, 'This room does not have any chess games.');
        		let game = Bot.rooms[room].chess;
        		if (!(game[game.turn].player === toId(by))) return;
        		return Bot.say(room, `/adduhtml CHESS,${game.boardHTML(room, game.turn)}`);
        	}
            case 'substitute': {
                if (!Bot.rooms[room].chess) return Bot.pm(by, 'This room does not have any chess games.');
                let game = Bot.rooms[room].chess;
                if (!(toId(by) === game.host)) return Bot.pm(by, 'Access denied.');
                return Bot.say(room, 'In progress.');
            }
        }
    }
}