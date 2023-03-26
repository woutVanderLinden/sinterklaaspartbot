module.exports = {
	cooldown: 0,
	help: `Shows ongoing raids`,
	permissions: 'none',
	commandFunction: function (Bot, room, time, by, args, client) {
		const protoDB = require('origindb')('data/POGO'), DB = protoDB('users');
		let html = '<hr/>', staffHTML = '<hr/>';
		const raids = Object.entries(Bot.rooms[room].raids || {});
		if (!raids.length) {
			html += 'No raids are currently going on.';
			staffHTML += 'No raids are currently going on.';
		} else {
			// eslint-disable-next-line max-len
			html += raids.map(([host, raid]) => `${tools.escapeHTML(raid.hostName)}'s ${raid.wb ? 'WB' : ''} ${raid.pokemon} <span title="${Object.keys(raid.players).map(u => DB.get(u).displayName).map(u => tools.unescapeHTML(u)).join(', ').replace(/"/g, '')}">${Object.keys(raid.players).length}/${raid.slots}</span> &nbsp; <button name="send" value="/botmsg ${Bot.status.nickName},${prefix}joinraid ${raid.host}"${Object.keys(raid.players).length >= raid.slots ? ' disabled' : ''}>Join</button> <button name="send" value="/botmsg ${Bot.status.nickName},${prefix}leaveraid ${raid.host}">Leave</button>`).join('<br/>');
			// eslint-disable-next-line max-len
			staffHTML += raids.map(([host, raid]) => `${tools.escapeHTML(raid.hostName)}'s ${raid.wb ? 'WB' : ''} ${raid.pokemon} <span title="${Object.keys(raid.players).map(u => DB.get(u).displayName).map(u => tools.unescapeHTML(u)).join(', ').replace(/"/g, '')}">${Object.keys(raid.players).length + 1}/${raid.slots + 1}</span> &nbsp; <button name="send" value="/botmsg ${Bot.status.nickName},${prefix}joinraid ${raid.host}"${Object.keys(raid.players).length >= raid.slots ? ' disabled' : ''}>Join</button> <button name="send" value="/botmsg ${Bot.status.nickName},${prefix}leaveraid ${raid.host}">Leave</button> <button name="send" value="/botmsg ${Bot.status.nickName},${prefix}endraid ${raid.host}">End</button> | Ends in ${tools.toHumanTime(raid.endTime - Date.now())}`).join('<br/>');
		}
		html += '<hr/>';
		staffHTML += '<hr/>';
		if (tools.hasPermission(by, 'gamma', room)) {
			Bot.say(room, `/adduhtml POGORAIDS, ${html}`);
			Bot.say(room, `/addrankuhtml +, POGORAIDS, ${staffHTML}`);
		} else Bot.say(room, `/sendprivatehtmlbox ${by}, ${html}`);
	}
};
