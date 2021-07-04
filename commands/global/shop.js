module.exports = {
	cooldown: 1,
	help: `Displays the room Shop.`,
	permissions: 'none',
	commandFunction: function (Bot, room, time, by, args, client) {
		if (!Bot.rooms[room].shop) return Bot.pm(by, "This room doesn't have a Shop!");
		if (!Bot.rooms[room].lb) return Bot.pm(by, "No points here.");
		let user = {}, shop = Bot.rooms[room].shop, lb = Bot.rooms[room].lb;
		user = lb.users[toID(by)] || {points: Array.from({length: lb.points.length}).map(t => 0)};
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
		// Jesus this needs an overhaul
		return Bot.sendHTML(by, out);
	}
}