module.exports = {
	cooldown: 500,
	help: `Creates a new question for the Mental Math! game. Syntax: ${prefix}newquestion (difficulty)`,
	permissions: 'beta',
	commandFunction: function (Bot, room, time, by, args, client) {
		if (Bot.rooms[room].gameActive) return Bot.say(room, 'A question is already active! Answer that first, please, UwU.');
		let diff = 1;	
		if (!isNaN(Bot.rooms[room].diff)) diff = Bot.rooms[room].diff;
		if (args[0] && parseInt(args[0].replace(/[^0-9]/g,'')) < 4) diff = parseInt(args[0].replace(/[^0-9]/g,''));
		Bot.rooms[room].diff = diff;
		switch (diff) {
			case 0: {
				if (Math.random() < 0.5) {
					let ques = Math.floor(Math.random() * 10) + ' * ' + Math.floor(Math.random() * 10);
					Bot.say(room, '**Question: ' + ques + ' = ?**');
					Bot.rooms[room].ques = ques;
					Bot.rooms[room].ans = eval(ques);
					Bot.rooms[room].gameActive = true;
				}
				else {
					let signs = ['+', '-'];
					let ques = Math.floor(Math.random() * 100) + ' ' + signs[Math.floor(Math.random() * 2)] + ' ' + Math.floor(Math.random() * 100);
					Bot.say(room, '**Question: ' + ques + ' = ?**');
					Bot.rooms[room].ques = ques;
					Bot.rooms[room].ans = eval(ques);
					Bot.rooms[room].gameActive = true;
				}
				break;
			}
			case 1: {
				if (Math.random() < 0.3) {
					let ques = Math.floor(Math.random() * 100) + ' * ' + Math.floor(Math.random() * 10);
					Bot.say(room, '**Question: ' + ques + ' = ?**');
					Bot.rooms[room].ques = ques;
					Bot.rooms[room].ans = eval(ques);
					Bot.rooms[room].gameActive = true;
				}
				else {
					let signs = ['+', '-'];
					let ques = Math.floor(Math.random() * 1000) + ' ' + signs[Math.floor(Math.random() * 2)] + ' ' + Math.floor(Math.random() * 1000);
					Bot.say(room, '**Question: ' + ques + ' = ?**');
					Bot.rooms[room].ques = ques;
					Bot.rooms[room].ans = eval(ques);
					Bot.rooms[room].gameActive = true;
				}
				break;
			}
			case 2: {
				let signs = ['+', '-', '*', '%'];
				let ques = '';
				switch (['+', '*'][Math.floor(Math.random() * 2)]) {
					case '+': {
						ques = Math.floor(Math.random() * 100000) + ' ' + ['+','-'][Math.floor(Math.random() * 2)] + ' ' + Math.floor(Math.random() * 100000);
						break;
					}
					default: {
						ques = Math.floor(Math.random() * 100) + ' * ' + Math.floor(Math.random() * 10);
						break;
					}
				}
				Bot.say(room, '**Question: ' + ques + ' = ?**');
				Bot.rooms[room].ques = ques;
				Bot.rooms[room].ans = eval(ques);
				Bot.rooms[room].gameActive = true;
				break;
			}
			case 3: {
				let ques = '';
				switch (['+', '*', '%', '/', '^'][Math.floor(Math.random() * 5)]) {
					case '+': {
						ques = Math.floor(Math.random() * 1000000) + ' ' + ['+','-'][Math.floor(Math.random() * 2)] + ' ' + Math.floor(Math.random() * 1000000);
						Bot.rooms[room].ans = eval(ques);
						break;
					}
					case '*': {
						ques = Math.floor(Math.random() * 100) + ' * ' + Math.floor(Math.random() * 100);
						Bot.rooms[room].ans = eval(ques);
						break;
					}
					case '%': {
						ques = Math.floor(Math.random() * 1000) + ' % ' + Math.floor(Math.random() * 100);
						Bot.rooms[room].ans = eval(ques);
						break;
					}
					case '/': {
						let a = Math.floor(Math.random() * 10000), b = Math.floor(Math.random() * a / 100);
						ques = a + ' / ' + b + ' (floored)';
						Bot.rooms[room].ans = Math.floor(a / b);
						break;
					}
					case '^': {
						ques = Math.floor(Math.random() * 100) + ' ^ ' + Math.floor(Math.random() * 2 + 2);
						Bot.rooms[room].ans = eval(ques.replace(/\^/g, '**'));
						break;
					}
					default: {
						return Bot.say(room, 'Something went wrong.');
						break;
					}
				}
				Bot.say(room, '**Question: ' + ques + ' = ?**');
				Bot.rooms[room].ques = ques;
				Bot.rooms[room].gameActive = true;
				break;
			}
		}
		if (!Bot.rooms[room].scores) Bot.rooms[room].scores = {};
		if (!Bot.rooms[room].times) Bot.rooms[room].times = {};
		Bot.rooms[room].questionTime = Date.now();
	}
}