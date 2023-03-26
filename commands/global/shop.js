module.exports = {
	cooldown: 1,
	help: `Displays the room Shop.`,
	permissions: 'none',
	commandFunction: function (Bot, room, time, by, args, client) {
		if (!Bot.rooms[room].shop) return Bot.pm(by, "This room doesn't have a Shop!");
		if (!Bot.rooms[room].lb) return Bot.pm(by, "No points here.");
		let user = {};
		const shop = Bot.rooms[room].shop, lb = Bot.rooms[room].lb;
		user = lb.users[toID(by)] || { points: Array.from({ length: lb.points.length }).map(t => 0) };
		// eslint-disable-next-line max-len
		let out = `<div style="background: white; color: black;">${shop.img && shop.img.src ? `<img src="${shop.img.src}" height="137" width="126" style="float: left; align: top">` : ''}<center><br><br><b style="font-family: verdana;">Your Balance:</b><div style="font-family:courier;"><br>${lb.points.map((p, i) => `${p[1]}: ${user.points[i]}`).join('<br>')}<br><br><br></div><details><summary><b style="font-family: verdana; font-size: 95%">Available Items:</b></summary><br><div style="font-family:courier;">`;
		const data = shop.inventory;
		// eslint-disable-next-line max-len
		out += tools.board(Object.keys(data).map(id => [`<button name="send" value="/msg ${Bot.status.nickName},${prefix}buyitem ${room}, ${id}" style="background: none; border: none; font-family: courier; color: black; font-size: 100%">${data[id].name}</button>`, ...data[id].cost]), ['Name', ...lb.points.map(p => p[2])], (row) => -(row[1] + row[2] * 100000), ['180px', ...Array.from({ length: lb.points.length }).map(t => Math.ceil(120 / lb.points.length) + 'px')], 'shop', null);
		out += `</div></details><br></center></div>`;
		// TODO: Jesus this needs an overhaul
		return Bot.sendHTML(by, out);
	}
};
