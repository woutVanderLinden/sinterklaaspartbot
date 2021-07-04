module.exports = {
	help: `Displays a random (or specified) xkcd.`,
	pm: true,
	commandFunction: function (args, message, Bot) {
		let max = 2426, rand = args.length ? toID(args.join('')) : Math.floor(Math.random() * (max - 1)) + 1;
		if (!(rand <= max)) return message.channel.send(`Out of the ${max} XKCD comics I'm aware of, that doesn't seem to look like a valid number.`);
		require('axios').get(`https://xkcd.com/${rand}/info.0.json`).then(res => message.channel.send(`${res.data.safe_title} [#${rand}]`).then(msg => message.channel.send(res.data.img)));
	}
}