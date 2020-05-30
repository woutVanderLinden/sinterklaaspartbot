module.exports = {
	cooldown: 1,
	help: `Displays the room Shop. Use \`\`${prefix}shop full\`\` to view the full shop.`,
	permissions: 'none',
	commandFunction: function (Bot, room, time, by, args, client) {
		if (!Bot.rooms[room].shop) return Bot.say(room, "This room doesn't have a Shop!");
		let user = {}, shop = Bot.rooms[room].shop;
		if (Bot.rooms[room].shop.users[toId(by)]) user = Bot.rooms[room].shop.users[toId(by)];
		else user = {points: [0, 0]};
		let out = `<DIV style="background: white; color: black;">
	${shop.img && shop.img.src ? `<IMG src="${shop.img.src}" height="137" width="126" style="float: left; align: top">` : ''}
    <CENTER>
    	<BR>
    	<BR>
    	<B style="font-family: verdana;">Your Balance:</B>
    	<DIV style="font-family:courier;">
    		<BR>
	    	${shop.points ? shop.points[1] : 'Points'}: ${user.points[0]}
	    	<BR>
	    	${shop.spc[1]}: ${user.points[1]}
	    	<BR>
	    	<BR>
	    	<BR>
	    </DIV>
    	<DETAILS><SUMMARY><B style="font-family: verdana; font-size: 95%">Available Items:</B></SUMMARY>
    		<BR>
	    	<DIV style="font-family:courier;">`;
	    	let data = Bot.rooms[room].shop.inventory;
	    	out += tools.board(Object.keys(data).map(id => [`<BUTTON name="send" value="/msg ${Bot.status.nickName},${prefix}buyitem ${Bot.rooms[room].title}, ${id}" style="background: none; border: none; font-family: courier; color: black; font-size: 100%">${data[id].name}</BUTTON>`, data[id].cost[0], data[id].cost[1]]), ['Name', shop.points[2], shop.spc[2]], (row) => (-(row[1] + row[2] * 100000)), ['180px', '60px', '50px'], 'shop', null);
	    	out += `
		    </DIV>
		</DETAILS>
		<BR>
    </CENTER>
</DIV>`;
		return Bot.sendHTML(by, out);
	}
}
