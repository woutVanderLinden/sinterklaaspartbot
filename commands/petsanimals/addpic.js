module.exports = {
	cooldown: 0,
	help: `Adds an image URL to your pets display!`,
	permissions: 'none',
	commandFunction: function (Bot, room, time, by, args, client) {
		Bot.say(room, `/me hugs its zxc`);
		const DB = Bot.DB('pets');
		const [pet, url] = args.join(' ').split(/[,]/);
		if (!pet || !url) return Bot.roomReply(room, by, `You need to specify both the pet's name and the image link!`);
		// Test the image
		axios.head(url).then(res => {
			if (!res.headers['content-type'].match(/image\/(?:png|jpeg|webp|gif)/)) {
				return Bot.roomReply(room, by, `Errm apparently the link you sent isn't an image URL`);
			}
			const user = toID(by);
			const obj = DB.get(user);
			if (!obj) obj = {};
			const petID = toID(pet);
			if (!obj.pets?.[petID]) {
				// eslint-disable-next-line max-len
				return Bot.roomReply(room, by, `You need to register the pet first before adding pics! Use the \`\`${prefix}addpet\`\` command for this!`);
			}
			obj.pets[petID].images?.push(url);
			DB.set(user, obj);
			Bot.say(room, `!show ${url}, Added!`);
		}).catch((err) => {
			Bot.log(err);
			Bot.roomReply(room, by, `Invalid image URL! (Please don't tell me I'm being bad`);
		});
	}
};
