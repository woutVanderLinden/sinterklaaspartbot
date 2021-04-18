module.exports = {
	cooldown: 1000,
	help: `Room ke tour polls. Syntax: \`\`${prefix}tourpoll (time in words / 'hour')\`\``,
	permissions: 'beta',
	commandFunction: function (Bot, room, _time, by, args, client) {
		let param = toID(args.join(''));
		if (['end', 'stop', 'start'].includes(param)) {
			if (!Bot.rooms[room].tourpoll) return Bot.say(room, `Koi tour poll chalu nahi hai!`);
			if (!tools.runEarly(Bot.rooms[room].tourpoll.timer)) Bot.say(room, `Error occurred`);
			return;
		}
		if (['cancel', 'delete'].includes(param)) {
			if (!Bot.rooms[room].tourpoll) return Bot.say(room, `Koi tour poll chalu nahi hai!`);
			clearInterval(Bot.rooms[room].tourpoll.timer);
			delete Bot.rooms[room].tourpoll;
			Bot.say(room, `Tour poll cancel hua hai!`);
			return;
		}
		if (['status', 'view', 'current'].includes(param)) {
			if (!tools.hasPermission(by, 'beta', room)) return Bot.pm(by, 'Access denied.');
			if (!Bot.rooms[room].tourpoll) return Bot.say(room, `Koi tour poll chalu nahi hai!`);
			Bot.say(room, `Tour poll mei ${tools.toHumanTime(Bot.rooms[room].tourpoll.timer._endTime - Date.now())} bache hai.`);
			return;
		}
		if (Bot.rooms[room].poll) return Bot.pm(by, `A poll is already in progress!`);
		let time;
		if (['hour', 'onthehour', 'atthehour', 'oth', 'ath'].includes(param)) {
			let date = new Date();
			time = ((60 - (30 + date.getMinutes()) % 60)) * 60 * 1000;
			time -= date.getSeconds() * 1000;
		}
		else time = tools.fromHumanTime(param);
		if (!time) return Bot.pm(by, `Invalid time specified!`);
		const DB = require('origindb')('data/TOURS');
		let obj = DB('hindi').object();
		let opts = new Set();
		Bot.log(obj);
		while (opts.size < 4) opts.add(tools.random(obj));
		Bot.rooms[room].tourpoll = {
			votes: {},
			options: opts
		}
		Bot.rooms[room].tourpoll.timer = setTimeout(() => {
			let poll = Bot.rooms[room].tourpoll;
			if (!poll) return;
			let opts = poll.options, votes = {};
			opts.forEach(opt => votes[opt] = 0);
			Object.values(poll.votes).forEach(vote => votes[vote]++);
			let seq = Object.values(votes).sort((a, b) => b - a), max = seq[0];
			let res = Object.keys(votes).filter(vote => votes[vote] === max).random();
			Bot.say(room, `/adduhtml TOURPOLL, <div class="infobox"><p style="margin: 2px 0 5px 0"><span style="border: 1px solid #6a6; color: #848; border-radius: 4px; padding: 0 3px"><i class="fa fa-bar-chart"></i> Poll khatm</span><strong style="font-size: 11pt"> Aap kaunsa format khelna chahoge?</strong></p>${Object.keys(votes).map(tier => `<div style="margin-top: 14px"><strong>${tier} (${votes[tier]} vote${votes[tier] === 1 ? '' : 's'})</strong>${tier === res ? ' ⭐' : ''}</div>`).join('')}</div>`);
			Bot.say(room, `/tour create ${res}, elim`);
			obj[res][0] = 0;
			Object.keys(obj).forEach(tier => {
				if (opts.has(tier)) return;
				if (obj[tier][0] >= 7) return;
				obj[tier][0]++;
			});
			DB.save();
			delete Bot.rooms[room].tourpoll;
		}, time);
		Bot.rooms[room].tourpoll.timer._endTime = Date.now() + time;
		Bot.say(room, `/adduhtml TOURPOLL,<div class="infobox"><p style="margin: 2px 0 5px 0"><span style="border: 1px solid #6a6; color: #848; border-radius: 4px; padding: 0 3px"><i class="fa fa-bar-chart"></i> Tour Poll</span><strong style="font-size: 11pt"> Aap kaunsa format khelna chahoge?</strong></p>${[...opts].map(tier => `<div style="margin-top: 5px"><button class="button" value="/msg ${Bot.status.nickName}, ${prefix}tourpoll vote ${room}, ${tier}" name="send"> <strong>${tier}</strong></button></div>`).join('')}</div>`);
	}
}