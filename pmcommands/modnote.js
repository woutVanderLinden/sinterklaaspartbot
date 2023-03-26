module.exports = {
	help: `Modnote features. Syntax: ${prefix}modnote (room), (text)`,
	permissions: 'none',
	commandFunction: function (Bot, by, args, client) {
		const cargs = args.join(' ').split(',');
		if (cargs.length < 2) return Bot.pm(by, unxa);
		const room = tools.getRoom(cargs.shift());
		if (!room || !Bot.rooms[room]) return Bot.pm(by, "I don't seem to be in that room.");
		if (!tools.canHTML(room)) return Bot.pm(by, "I don't have the permissions for this, sorry. I need to be roombot.");
		if (!tools.hasPermission(by, 'beta', room)) return Bot.pm(by, "This command can only be used by roomstaff");
		const user = Bot.rooms[room].users.find(u => toID(u) === toID(by));
		if (!user) return Bot.pm(by, `You're not roomstaff; only roomstaff have permission to use this.`);
		const name = user.substr(1).replace(/@!$/, '').replace(/</g, '&lt;');
		// eslint-disable-next-line max-len
		Bot.say(room, `/addrankhtmlbox *, <div class="chat chatmessage-partbot" style="display:inline-block;"><small>[MODNOTE] ${user[0]}</small>${tools.colourize(name + ':').replace(name, `<span class="username" data-roomgroup="${user[0]}" data-name="${user.substr(1)}">${name}</span>`)}<em> ${cargs.join(',').replace(/</g, '&lt;')}</em></div><br/><span style='color:#444444;font-size:10px'>Note: Only users ranked % and above can see this.</span>`);
		// eslint-disable-next-line max-len
		Bot.say(room, `/sendhtmlpage ${by},modnote-${room},<center><form data-submitsend="/msgroom ${room},/botmsg ${Bot.status.nickName},${prefix}mn ${room}, {msg}"><br/><br/><input name="msg" type="text" style="width:500px"><br/><br/><input type="submit" value="Modnote" name="Modnote"></form></center>`);
	}
};
