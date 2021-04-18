module.exports = {
	help: `Displays a room's Shop. Syntax: ${prefix}shop (room)`,
	permissions: 'none',
	commandFunction: function (Bot, by, args, client) {
		let room = args.join('').toLowerCase().replace(/[^a-z0-9-]/g, '');
		if (!room) {
			let rooms = Bot.getRooms(by).filter(r => Bot.rooms[r] && Bot.rooms[r].shop);
			if (rooms.length === 0) return Bot.pm(by, "You don't know any of my shops...");
			if (rooms.length === 1) room = rooms[0];
			else return Bot.sendHTML(by, `Multiple room shops found! Which did you mean?<br>` + rooms.map(r => `<button name="send" value="/msg ${Bot.status.nickName},${prefix}shop ${r}">${Bot.rooms[r].title}</button>`));
		}
		if (!room || !Bot.rooms[room]) return Bot.pm(by, 'Invalid room.');
		if (!Bot.rooms[room].shop) return Bot.pm(by, `${Bot.rooms[room].title} Doesn't have a Shop...`);
		if (!Bot.rooms[room].shop) return Bot.pm(by, "This room doesn't have a Shop!");
		if (!Bot.rooms[room].lb) return Bot.pm(by, "No points here.");
		let user = {}, shop = Bot.rooms[room].shop, lb = Bot.rooms[room].lb;
		user = lb.users[toId(by)] || {points: Array.from({length: lb.points.length}).map(t => 0)};
		let out = `<DIV style="background: white; color: black;">
	${shop.img && shop.img.src ? `<IMG src="${shop.img.src}" height="137" width="126" style="float: left; align: top">` : ''}
	<CENTER>
		<BR>
		<BR>
		<B style="font-family: verdana;">Your Balance:</B>
		<DIV style="font-family:courier;">
			<BR>
			${lb.points.map((p, i) => `${p[1]}: ${user.points[i]}`).join('\n\t\t\t<BR>\n\t\t\t')}
			<BR>
			<BR>
			<BR>
		</DIV>
		<DETAILS><SUMMARY><B style="font-family: verdana; font-size: 95%">Available Items:</B></SUMMARY>
			<BR>
			<DIV style="font-family:courier;">`;
			let data = shop.inventory;
			out += tools.board(Object.keys(data).map(id => [`<BUTTON name="send" value="/msg ${Bot.status.nickName},${prefix}buyitem ${room}, ${id}" style="background: none; border: none; font-family: courier; color: black; font-size: 100%">${data[id].name}</BUTTON>`, ...data[id].cost]), ['Name', ...lb.points.map(p => p[2])], (row) => (-(row[1] + row[2] * 100000)), ['180px', ...Array.from({length: lb.points.length}).map(t => Math.ceil(120 / lb.points.length) + 'px')], 'shop', null);
			out += `
			</DIV>
		</DETAILS>
		<BR>
	</CENTER>
</DIV>`;
		return Bot.sendHTML(by, out);
	}
}