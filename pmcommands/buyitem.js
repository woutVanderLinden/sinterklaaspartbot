module.exports = {
	help: `Buys an item from a room. Syntax: ${prefix}buyitem (room), (item ID | confirm)`,
	permissions: 'none',
	commandFunction: function (Bot, by, args, client) {
		let user = toId(by);
		let cargs = args.join(' ').split(/\s*,\s*/);
		if (!cargs[1]) return Bot.pm(by, unxa);
		let room = cargs.shift().toLowerCase().replace(/[^a-z0-9-]/g, '');
		if (!room || !Bot.rooms[room]) return Bot.pm(by, 'Invalid room.');
		if (!Bot.rooms[room].shop) return Bot.pm(by, 'Sorry, that room doesn\'t have a Shop.');
		let shop = Bot.rooms[room].shop;
		let id = toId(cargs.join(''));
		if (id == 'confirm') {
			if (!Bot.rooms[room].shop.temp[user]) return Bot.pm(by, 'You don\'t have anything to confirm!');
			let item = Bot.rooms[room].shop.inventory[Bot.rooms[room].shop.temp[user]];
			user = Bot.rooms[room].shop.users[user];
			if (user.points[0] < item.cost[0] || user.points[1] < item.cost[1]) return Bot.log("URGENT: Price limiter fail!");
			client.channels.cache.get(Bot.rooms[room].shop.channel).send(`${by.substr(1)} bought: ${item.name}.`);
			user.points[0] -= item.cost[0];
			user.points[1] -= item.cost[1];
			tools.updateShops(room);
      delete Bot.rooms[room].shop.temp[toId(by)];
			return Bot.pm(by, `Your purchase of ${item.name} has been noted! Staff will get back to you soon. <3`);
		}
		if (!shop.inventory[id]) return Bot.pm(by, 'Sorry, it doesn\'t look like that item is available.');
		Bot.pm(by, `Selected item: ${shop.inventory[id].name}${shop.inventory[id].desc ? ` (${shop.inventory[id].desc})` : ''}.`);
		if (!shop.users[user] || shop.users[user].points[0] < shop.inventory[id].cost[0] || shop.users[user].points[1] < shop.inventory[id].cost[1]) return Bot.pm(by, 'Sorry, it looks like you can\'t afford that yet!');
		Bot.rooms[room].shop.temp[user] = id;
		let item = shop.inventory[id];
		return Bot.pm(by, `You have chosen to buy: ${item.name} for ${item.cost[0]} ${shop.points[2]} and ${item.cost[1]} ${shop.spc[2]}. Send \`\`${prefix}buyitem ${Bot.rooms[room].title}, confirm\`\` to confirm.`);
	}
}