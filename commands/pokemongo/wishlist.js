module.exports = {
	help: `Shows a list of people who're looking for a specific Pokemon`,
	permissions: 'none',
	commandFunction: function (Bot, room, time, by, args, client, isPM) {
		function reject (m) {
			if (tools.hasPermission(by, room, 'gamma') && !isPM) return Bot.say(room, m);
			else return isPM ? Bot.pm(by, m) : Bot.roomReply(room, by, m);
		}
		const protoDB = require('origindb')('data/POGO'), DB = protoDB('users');
		const monID = toID(args.join(''));
		if (!monID) return reject(`Please mention the Pokemon's name!`);
		if (monID === 'constructor') {
			return reject(`Error: cannot read property 'constructor' of a random nerd who's trying to break me`);
		}
		const mon = data.pokedex[monID];
		if (!mon) {
			// eslint-disable-next-line max-len
			return reject(`Sorry, but I don't recognize ${monID} as a Pokemon! Please format the name the same way Pokemon Showdown does!`);
		}
		const users = Object.values(DB.object()).filter(user => user.raids.hasOwnProperty(monID));
		const format = user => {
			let out = `${user.displayName} [${user.ign}]`;
			if (Bot.rooms[room].users.find(u => toID(u) === user.username)) out = `<strong>${out}</strong>`;
			return out;
		};
		const nwb = users.filter(user => user.raids[monID] === false);
		const wb = users.filter(user => user.raids[monID] === true);
		// eslint-disable-next-line max-len
		const html = `<div style="font-size:1.2em;font-weight:bold;margin-top:5px;">Looking for ${mon.name} (${nwb.length}+${wb.length})</div><br/>${nwb.map(format).join('<br/>')}${wb.length ? `<br/><details style="margin-top:5px;"><summary>(only Weather Boosted)</summary>${wb.map(format).join('<br/>')}</details>` : ''}`;
		if (isPM) Bot.sendHTML(by, html);
		else if (tools.hasPermission(by, 'gamma', room)) Bot.say(room, `/adduhtml WISHLIST${monID}, ${html}`);
		else Bot.say(room, `/sendprivateuhtml WISHLIST${monID}, ${html}`);
	}
};
