module.exports = {
	help: `Queries the WolframAlpha database. Please use sparingly. Remember, you are responsible for the output of this command.`,
	pm: true,
	commandFunction: function (args, message, Bot) {
		// To anyone who reads this code
		// I sincerely apologize
		let query = args.join(' '), link;
		axios.get(link = `http://api.wolframalpha.com/v2/query?appid=${require('../../config.js').wolframToken}&input=${query}&format=plaintext,image`).then(response => {
			let info = response.data;
			let img = info.match(/<img src=(['"]).*?\1/), imgt;
			let txt = info.match(/<plaintext>.*?<\/plaintext>/g);
			const Discord = require('discord.js'), embed = new Discord.MessageEmbed().setColor('#FF4500');
			if (!txt && !img) {
				Bot.log(info);
				return message.channel.send("Nothing found.");
			}
			embed.setTitle("Result: ");
			if (txt) embed.addField('\u200b', tools.unescapeHTML(txt.join('\n').replace(/<\/?plaintext>/g, '').replace(/@(?:everyone|here)/g, match => '@\u200b' + match.substr(1))));
			if (img) embed.setImage(imgt = tools.unescapeHTML(img[0].substr(10).split(/['"]/)[0]));
			// Bot.log(info);
			// Bot.log(img);
			// Bot.log(imgt);
			message.channel.send(embed);
		}).catch(err => {
			message.channel.send("Sorry, nothing found!");
			Bot.log(err);
		});
	}
}