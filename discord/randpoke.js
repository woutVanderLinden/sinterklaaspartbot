module.exports = {
	help: `Random Pokemon! No filters work, but numbers do.`,
	pm: true,
	commandFunction: function (args, message, Bot) {
		let num = 1;
		if (!isNaN(parseInt(args.join('')))) num = parseInt(args.join(''));
		return message.channel.send("```" + Object.values(data.pokedex).filter(m => m.num > 0 && !m.forme && !(m.eggGroups.join('') === 'Undiscovered' && Object.values(m.baseStats).reduce((a, b) => a + b) > 500)).map(m => m.name).random(num).join(', ') + "```");
	}
}
