module.exports = {
	help: `Displays a room's Shop. Syntax: ${prefix}shop (room)`,
	permissions: 'none',
	commandFunction: function (Bot, by, args, client) {
		if (!args) return Bot.pm(by, unxa);
		let room = args.join('').toLowerCase().replace(/[^a-z0-9-]/g, '');
		if (!room || !Bot.rooms[room]) return Bot.pm(by, 'Invalid room.');
		if (!Bot.rooms[room].shop) return Bot.pm(by, `${Bot.rooms[room].title} Doesn't have a Shop...`);
		let user = {}, shop = Bot.rooms[room].shop;
		if (Bot.rooms[room].shop.users[toId(by)]) user = Bot.rooms[room].shop.users[toId(by)];
		else user = {points: [0, 0]};
		let out = `<DIV style="background: white; color: black;">
	${shop.img && shop.img.src ? `<IMG src="${shop.img.src}" height="137" width="126" style="float: left; align: top">` : ''}
    <CENTER>
    	<BR/>
    	<BR/>
    	<B style="font-family: verdana;">Your Balance:</B>
    	<DIV style="font-family:courier;">
    		<BR/>
	    	${shop.points ? shop.points[1] : 'Points'}: ${user.points[0]}
	    	<BR/>
	    	${shop.spc[1]}: ${user.points[1]}
	    	<BR/>
	    	<BR/>
	    	<BR/>
	    </DIV>
    	<DETAILS><SUMMARY><B style="font-family: verdana; font-size: 95%">Available Items:</B></SUMMARY>
    		<BR/>
	    	<DIV style="font-family:courier;">
		    	<TABLE style="border-collapse: collapse">
		    		<TR>
		    			<TH style="text-align: center; border: 1px solid #bbb; color: white; background-color: #0080FF" width="140">Name</TH>
		    			<TH style="text-align: center; border: 1px solid #bbb; color: white; background-color: #0080FF" width="60">${shop.points[2]}</TH>
		    			<TH style="text-align: center; border: 1px solid #bbb; color: white; background-color: #0080FF" width="50">${shop.spc[2]}</TH>
		    		</TR>`;
		Object.keys(shop.inventory).forEach(item => {
			out += `		    		<TR>
		    			<TD style="text-align: center; border: 1px solid #bbb;"><BUTTON name="send" value="/w ${Bot.status.nickName},${prefix}buyitem ${Bot.rooms[room].title}, ${item}" style="background: none; border: none; font-family: courier; color: black; font-size: 100%">${shop.inventory[item].name}</BUTTON></TD>
		    			<TD style="text-align: center; border: 1px solid #bbb;">${shop.inventory[item].cost[0]}</TD>
		    			<TD style="text-align: center; border: 1px solid #bbb;">${shop.inventory[item].cost[1]}</TD>
		    		</TR>`;
		});
		out += `		    	</TABLE>
		    </DIV>
		</DETAILS>
		<BR/>
    </CENTER>
</DIV>`;
		return Bot.sendHTML(by, out);
	}
}