module.exports = {
	help: `Displays a room's Shop. Syntax: ${prefix}shop (room)`,
	permissions: 'none',
	commandFunction: function (Bot, by, args, client) {
		let room = tools.getRoom(args.join('').toLowerCase().replace(/[^a-z0-9-]/g, ''));
		if (!room) {
			const rooms = Bot.getRooms(by).filter(r => Bot.rooms[r] && Bot.rooms[r].shop);
			if (rooms.length === 0) return Bot.pm(by, "You don't know any of my shops...");
			if (rooms.length === 1) room = rooms[0];
			// eslint-disable-next-line max-len
			else return Bot.sendHTML(by, `Multiple room shops found! Which did you mean?<br>` + rooms.map(r => `<button name="send" value="/msg ${Bot.status.nickName},${prefix}shop ${r}">${Bot.rooms[r].title}</button>`));
		}
		if (!room || !Bot.rooms[room]) return Bot.pm(by, 'Invalid room.');
		if (!Bot.rooms[room].shop) return Bot.pm(by, `${Bot.rooms[room].title} doesn't have a Shop...`);
		if (!Bot.rooms[room].lb) return Bot.pm(by, "No points here.");
		const shop = Bot.rooms[room].shop;
		const lb = Bot.rooms[room].lb;
		const user = lb.users[toID(by)] || { points: Array.from({ length: lb.points.length }).map(t => 0) };
		// TODO: Holy shit rewrite this HTML
		let out = `<div style="background: white; color: black;">
			${shop.img && shop.img.src ? `<img src="${shop.img.src}" height="137" width="126" style="float: left; align: top">` : ''}
			<center>
				<br>
				<br>
				<b style="font-family: verdana;">Your Balance:</b>
				<div style="font-family:courier;">
					<br>
					${lb.points.map((p, i) => `${p[1]}: ${user.points[i]}`).join('\n\t\t\t<br>\n\t\t\t')}
					<br>
					<br>
					<br>
				</div>
				<details><summary><b style="font-family: verdana; font-size: 95%">Available Items:</b></summary>
					<br>
					<div style="font-family:courier;">`;
		const data = shop.inventory;
		// eslint-disable-next-line max-len
		out += tools.board(Object.keys(data).map(id => [`<button name="send" value="/msg ${Bot.status.nickName},${prefix}buyitem ${room}, ${id}" style="background: none; border: none; font-family: courier; color: black; font-size: 100%">${data[id].name}</button>`, ...data[id].cost]), ['Name', ...lb.points.map(p => p[2])], (row) => -(row[1] + row[2] * 100000), ['180px', ...Array.from({ length: lb.points.length }).map(t => Math.ceil(120 / lb.points.length) + 'px')], 'shop', null);
		out += `
					</div>
				</details>
				<br>
			</center>
		</div>`;
		return Bot.sendHTML(by, out);
	}
};
