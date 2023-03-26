module.exports = {
	help: `Serene WCoP 1v1`,
	guildOnly: '852522875054325772',
	commandFunction: function (args, message, Bot) {
		const teams = [{
			url: 'https://pokepast.es/1290303f2a09c459',
			mons: ['Kartana', 'Aromatisse', 'Necrozma'],
			comments: {
				PartMan: `Loses to AV Arc (Necro is a coinflip)`
			}
		}, {
			url: 'https://pokepast.es/5323f3979843ccfe',
			mons: ['Regidrago', 'Registeel', 'Primarina'],
			comments: {
				doc1203: 'Loses to Naga'
			}
		}, {
			url: 'https://pokepast.es/f62c3166170b30c3',
			mons: ['Arcanine', 'Magnezone', 'Swampert'],
			comments: {}
		}];
		const embed = new Discord.MessageEmbed().setColor('#00ff00');
		teams.forEach(team => embed
			.addField('\u200b', `[${team.mons.join(' / ')}](${team.url})`)
			.addField('Comments:', '\u200b')
			.addFields(Object.keys(team.comments).map(k => ({ name: k, value: team.comments[k] })))
			.addField('\u200b', '\u200b'));
		message.channel.send(embed);
	}
};
